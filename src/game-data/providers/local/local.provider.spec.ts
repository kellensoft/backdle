import { LocalGameDataProvider } from './local.provider';
import { ManifestService } from '../../manifest.service';
import { GameSourceConfig } from '../../types';
import * as path from 'path';

describe('LocalGameDataProvider', () => {
  let provider: LocalGameDataProvider;
  let gameConfig: GameSourceConfig;

  const mockManifestService = {
    getAllGameConfigs: jest.fn(() => ({
      coffeedle: { provider: 'local', path: 'data/coffeedle' },
      blankdle: { provider: 'local', path: 'data/blankdle' }
    })),
  } as unknown as ManifestService;

  beforeEach(() => {
    provider = new LocalGameDataProvider(mockManifestService);
    gameConfig = {
      provider: 'local',
      path: path.join(process.cwd(), 'data/coffeedle'),
    };
  });

  it('should return gameInfo with yesterdaysAnswer and games', async () => {
    const info = await provider.getGameInfo(gameConfig);
    expect(info.name).toBe('Coffeedle');
    expect(info.yesterdaysAnswer).toBeDefined();
    expect(Array.isArray(info.games)).toBe(true);
    expect(Array.isArray(info.clueTypes)).toBe(true);
    expect(info.icon).toMatch(/^\/static\/coffeedle\/icon\.png$/);
    expect(info.background).toMatch(/^\/static\/coffeedle\/background\.png$/);
  });

  it('should return guess validation for known entry', async () => {
    const guess = await provider.guess(gameConfig, 'americano');
    expect(guess.guess).toBe('americano');
    expect(Array.isArray(guess.validation)).toBe(true);
    expect(guess.image).toMatch(/americano\.png$/);
  });

  it('should return autocomplete results for partial match', async () => {
    const results = await provider.autocomplete(gameConfig, 'ame');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain('ame');
  });

  it('should return a clue for known type', async () => {
    const clue = await provider.clue(gameConfig, 'Hint');
    expect(clue.type).toBe('Hint');
    expect(typeof clue.value).toBe('string');
  });
});
