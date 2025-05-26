import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Attribute {
  @Field() type: string;
  @Field() value: string;
  @Field() color: string;
  @Field() direction: string;
}

@ObjectType()
export class Clue {
  @Field() type: string;
  @Field() value: string;
}

@ObjectType()
export class ClueType {
  @Field() clueType: string;
  @Field() clueDescription: string;
}

@ObjectType()
export class Game {
  @Field() name: string;
  @Field() icon: string;
}

@ObjectType()
export class GameInfo {
  @Field() name: string;
  @Field() backgroundColor: string;
  @Field() borderColor: string;
  @Field() textColor: string;
  @Field() header: string;
  @Field() body: string;
  @Field(() => [ClueType]) clueTypes: ClueType[];
  @Field() placeholder: string;
  @Field(() => [Game]) games: Game[];
  @Field() yesterdaysAnswer: string;
  @Field() icon: string;
  @Field() background: string;
}

@ObjectType()
export class GuessInfo {
  @Field() guess: string;
  @Field(() => [Attribute]) validation: Attribute[];
  @Field({ nullable: true }) image?: string;
}

@ObjectType()
export class AutocompleteResult {
  @Field() name: string;
  @Field({ nullable: true }) image?: string;
}

export interface GameManifest {
  [game: string]: GameSourceConfig;
}

export interface GameSourceConfig {
  provider: 'local' | 'remote' | 'db';
  path?: string;
  url?: string;
  table?: string;
}

export interface GameDataProvider {
  getGameInfo(config: GameSourceConfig): Promise<GameInfo>;
  guess(config: GameSourceConfig, word: string): Promise<GuessInfo>;
  clue(config: GameSourceConfig, type: string): Promise<Clue>;
  autocomplete(
    config: GameSourceConfig,
    search: string,
  ): Promise<AutocompleteResult[]>;
}
