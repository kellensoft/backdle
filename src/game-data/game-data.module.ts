import { Module } from '@nestjs/common';
import { GameDataService } from './game-data.service';
import { GameDataResolver } from './game-data.resolver';
import { ManifestService } from './manifest.service';
import { LocalGameDataProvider } from './providers/local/local.provider';

@Module({
  providers: [
    GameDataService,
    GameDataResolver,
    ManifestService,
    LocalGameDataProvider,
  ],
})
export class GameDataModule {}
