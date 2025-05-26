import { Injectable } from '@nestjs/common';
import { ManifestService } from './manifest.service';
import {
  GameDataProvider,
  GameInfo,
  GuessInfo,
  Clue,
  AutocompleteResult,
} from './types';
import { LocalGameDataProvider } from './providers/local/local.provider';

@Injectable()
export class GameDataService {
  private readonly providerMap: Record<string, GameDataProvider>;

  constructor(
    private readonly manifestService: ManifestService,
    private readonly localProvider: LocalGameDataProvider,
  ) {
    this.providerMap = {
      local: this.localProvider,
    };
  }

  private getProvider(game: string): {
    config: any;
    provider: GameDataProvider;
  } {
    const config = this.manifestService.getGameConfig(game);
    const provider = this.providerMap[config.provider];
    if (!provider) throw new Error(`No provider for type: ${config.provider}`);
    return { config, provider };
  }

  getGameInfo(game: string): Promise<GameInfo> {
    const { config, provider } = this.getProvider(game);
    return provider.getGameInfo(config);
  }

  guess(game: string, word: string): Promise<GuessInfo> {
    const { config, provider } = this.getProvider(game);
    return provider.guess(config, word);
  }

  clue(game: string, type: string): Promise<Clue> {
    const { config, provider } = this.getProvider(game);
    return provider.clue(config, type);
  }

  autocomplete(game: string, search: string): Promise<AutocompleteResult[]> {
    const { config, provider } = this.getProvider(game);
    return provider.autocomplete(config, search);
  }
}
