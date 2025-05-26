import { Injectable, OnModuleInit } from '@nestjs/common';
import { GameManifest, GameSourceConfig } from './types';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ManifestService implements OnModuleInit {
  private manifest: GameManifest = {};

  async onModuleInit() {
    const manifestPath = join(process.cwd(), 'src/manifest.json');
    const raw = await fs.readFile(manifestPath, 'utf-8');
    this.manifest = JSON.parse(raw);

    const dataPath = join(process.cwd(), 'data');
    const entries = await fs.readdir(dataPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const gameName = entry.name;

      if (this.manifest[gameName]) continue;

      const gameJsonPath = join(dataPath, gameName, 'game.json');
      try {
        await fs.access(gameJsonPath);
        this.manifest[gameName] = {
          provider: 'local',
          path: join(dataPath, gameName),
        };
        console.log(`📦 Auto-added local game: ${gameName}`);
      } catch {
        console.warn(`⚠️ Skipped ${gameName}: no game.json`);
      }
    }
  }

  getGameConfig(game: string): GameSourceConfig {
    const config = this.manifest[game];
    if (!config) throw new Error(`Unknown game: ${game}`);
    return config;
  }

  getAllGameConfigs(): GameManifest {
    return this.manifest;
  }
}
