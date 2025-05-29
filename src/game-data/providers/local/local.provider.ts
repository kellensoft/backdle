import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, basename } from 'path';
import { ManifestService } from '../../manifest.service';
import {
  GameDataProvider,
  GameSourceConfig,
  GameInfo,
  GuessInfo,
  Clue,
  AutocompleteResult,
  Attribute,
  Game,
} from '../../types';

@Injectable()
export class LocalGameDataProvider implements GameDataProvider {
  constructor(private readonly manifestService: ManifestService) {}
  private indexCache: Map<string, Record<string, string>> = new Map();
  
  private async readJson<T = any>(path: string): Promise<T> {
    try {
      const raw = await fs.readFile(path, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error(`❌ Failed to parse JSON in ${path}:`, err.message);
      throw err;
    }
  }

  private isNumeric(value: string): boolean {
    return !isNaN(parseFloat(value)) && isFinite(Number(value));
  }

  private getStaticPath(value: string, filename: string) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/static/${value}/${filename}`
  }

  private async getIndexMap(basePath: string): Promise<Record<string, string>> {
    if (this.indexCache.has(basePath)) {
      return this.indexCache.get(basePath)!;
    }

    const indexPath = join(basePath, 'bank', 'index.json');
    const index = await this.readJson<Record<string, string>>(indexPath);
    
    this.indexCache.set(basePath, index);
    return index;
  }

  private async getAnswersForDate(basePath: string): Promise<{
    today: string;
    yesterday: string;
  }> {
    const index = await this.getIndexMap(basePath);
    const entries = Object.keys(index).sort();

    const getAnswerByDate = (date: Date): string => {
      const seed = Math.floor(date.getTime() / 1000 / 60 / 60 / 24); // Days since epoch
      const i = seed % entries.length;
      return entries[i];
    };

    const today = getAnswerByDate(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getAnswerByDate(yesterdayDate);

    return { today, yesterday };
  }

  async getGameInfo(config: GameSourceConfig): Promise<GameInfo> {
    const basePath = config.path!;
    const data = await this.readJson<GameInfo>(join(basePath, 'game.json'));

    const { yesterday } = await this.getAnswersForDate(basePath);
    data.yesterdaysAnswer = yesterday;

    const manifest = this.manifestService.getAllGameConfigs();
    const games: Game[] = Object.keys(manifest).map(name => ({
      name,
      icon: this.getStaticPath(name, 'icon.png'),
    }));
    data.games = games;

    const gameName = basename(basePath);
    data["icon"] = this.getStaticPath(gameName, 'icon.png');
    data["background"] = this.getStaticPath(gameName, 'background.png');

    return data;
  }

  async guess(config: GameSourceConfig, word: string): Promise<GuessInfo> {
    const basePath = config.path!;
    
    const index = await this.getIndexMap(basePath);
    const guessId = index[word];
    if (!guessId) {
      throw new Error(`No entry for "${word}" found in index`);
    }
    const entryPath = join(basePath, 'bank', `${guessId}.json`);

    const entry = await this.readJson<{ attributes: Attribute[] }>(entryPath);

    const { today } = await this.getAnswersForDate(basePath);
    const answerId = index[today];
    if (!answerId) {
      throw new Error(`No entry for "${today}" found in index`);
    }
    const answerPath = join(basePath, 'bank', `${answerId}.json`);
    const answer = await this.readJson<{ attributes: Attribute[] }>(answerPath);

    const answerMap = new Map(answer.attributes.map(attr => [attr.type, attr.value]));

    const enriched = entry.attributes.map(attr => {
      const answerValue = answerMap.get(attr.type);

      let color = 'red';
      let direction = '';

      if (attr.value === answerValue) {
        color = 'green';
      } else if (!this.isNumeric(attr.value) && !this.isNumeric(answerValue)) {

        if (
          attr.value.toLowerCase().includes(answerValue.toLowerCase()) ||
          answerValue.toLowerCase().includes(attr.value.toLowerCase())
        ) {
          color = 'yellow';
        }
      } else if (this.isNumeric(attr.value) && this.isNumeric(answerValue)) {
        const guessNum = parseFloat(attr.value);
        const answerNum = parseFloat(answerValue);
        direction = guessNum < answerNum ? 'up' : 'down';
      }

      return {
        ...attr,
        color,
        direction,
      };
    });

    const gameName = basename(basePath);
    const imagePath = this.getStaticPath(gameName, `bank/${guessId}.png`);

    return {
      guess: word,
      validation: enriched,
      image: imagePath,
    };
  }

  async clue(config: GameSourceConfig, type: string): Promise<Clue> {
    const { today } = await this.getAnswersForDate(config.path!);
    const entryPath = join(config.path!, 'bank', `${today}.json`);

    const entry = await this.readJson<{ clues: Clue[] }>(entryPath);

    const clue = entry.clues.find(c => c.type === type);
    if (!clue) {
      throw new Error(`No clue of type "${type}" in answer: ${today}`);
    }

    return clue;
  }

  private matchesSearch(name: string, search: string): boolean {
    const words = name.toLowerCase().split(/\s+/); 
    const query = search.toLowerCase();
    return words.some(word => word.startsWith(query));
  }

  async autocomplete(config: GameSourceConfig, search: string): Promise<AutocompleteResult[]> {
    const basePath = config.path!;
    const gameName = basename(basePath);
    const index = await this.getIndexMap(basePath);

    return Object.entries(index)
    .filter(([name]) => this.matchesSearch(name, search))
    .map(([name, fileId]) => ({
      name,
      image: this.getStaticPath(gameName, `bank/${fileId}.png`)
    }));

  }
}
