import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ContentBlock {
  @Field() type: 'text' | 'image';
  @Field(() => [String], { nullable: true }) values?: string[];
  @Field(() => [String], { nullable: true }) urls?: string[];
}

@ObjectType()
export class Item {
  @Field() state: string;
  @Field(() => [ContentBlock]) content: ContentBlock[];
  @Field({ nullable: true }) arrow?: 'up' | 'down';
}

@ObjectType()
export class GuessInfo {
  @Field() guess: string;
  @Field(() => [Item]) validation: Item[];
  @Field({ nullable: true }) image?: string;
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
  @Field() header: string;
  @Field() body: string;
  @Field() placeholder: string;
  @Field(() => [String]) attributes: string[];
  
  // Making styling fields optional/nullable
  @Field({ nullable: true }) background?: string;
  @Field({ nullable: true }) icon?: string;
  @Field({ nullable: true }) logoTextColor?: string;
  @Field({ nullable: true }) logoFontFamily?: string;
  @Field({ nullable: true }) modalBackgroundColor?: string;
  @Field({ nullable: true }) modalBorderColor?: string;
  @Field({ nullable: true }) modalBorderWidth?: string;
  @Field({ nullable: true }) modalBorderRadius?: string;
  @Field({ nullable: true }) modalFontFamily?: string;
  @Field({ nullable: true }) modalTextColor?: string;
  @Field({ nullable: true }) infoBackgroundColor?: string;
  @Field({ nullable: true }) infoBorderColor?: string;
  @Field({ nullable: true }) infoBorderWidth?: string;
  @Field({ nullable: true }) infoBorderRadius?: string;
  @Field({ nullable: true }) infoFontFamily?: string;
  @Field({ nullable: true }) infoTextColor?: string;
  @Field({ nullable: true }) inputBackgroundColor?: string;
  @Field({ nullable: true }) inputBorderColor?: string;
  @Field({ nullable: true }) inputBorderWidth?: string;
  @Field({ nullable: true }) inputBorderRadius?: string;
  @Field({ nullable: true }) inputFontFamily?: string;
  @Field({ nullable: true }) inputTextColor?: string;
  @Field({ nullable: true }) tableFontFamily?: string;
  @Field({ nullable: true }) tableTextColor?: string;
  @Field({ nullable: true }) tileBorderColor?: string;
  @Field({ nullable: true }) tileBorderWidth?: string;
  @Field({ nullable: true }) tileBorderRadius?: string;
  @Field({ nullable: true }) tileColorCorrect?: string;
  @Field({ nullable: true }) tileColorIncorrect?: string;
  @Field({ nullable: true }) tileColorPartial?: string;
  @Field({ nullable: true }) tileColorDefault?: string;
  @Field({ nullable: true }) tileFontFamily?: string;
  @Field({ nullable: true }) tileTextCorrect?: string;
  @Field({ nullable: true }) tileTextInCorrect?: string;
  @Field({ nullable: true }) tileTextPartial?: string;
  @Field({ nullable: true }) tileTextDefault?: string;
  @Field({ nullable: true }) yesterdayBackgroundColor?: string;
  @Field({ nullable: true }) yesterdayBorderColor?: string;
  @Field({ nullable: true }) yesterdayBorderWidth?: string;
  @Field({ nullable: true }) yesterdayBorderRadius?: string;
  @Field({ nullable: true }) yesterdayFontFamily?: string;
  @Field({ nullable: true }) yesterdayTextColor?: string;
  @Field({ nullable: true }) yesterdayItemFontFamily?: string;
  @Field({ nullable: true }) yesterdayItemTextColor?: string;
  @Field({ nullable: true }) keyBackgroundColor?: string;
  @Field({ nullable: true }) keyBorderColor?: string;
  @Field({ nullable: true }) keyBorderWidth?: string;
  @Field({ nullable: true }) keyBorderRadius?: string;
  @Field({ nullable: true }) keyFontFamily?: string;
  @Field({ nullable: true }) keyTextColor?: string;
  @Field({ nullable: true }) atlasBackgroundColor?: string;
  @Field({ nullable: true }) atlasBorderColor?: string;
  @Field({ nullable: true }) atlasBorderWidth?: string;
  @Field({ nullable: true }) atlasBorderRadius?: string;
  @Field({ nullable: true }) atlasFontFamily?: string;
  @Field({ nullable: true }) atlasTextColor?: string;
  @Field({ nullable: true }) footerTextColor?: string;
  @Field({ nullable: true }) footerFontFamily?: string;
  
  @Field(() => [ClueType]) clueTypes: ClueType[];
  @Field(() => [Game]) games: Game[];
  @Field({ nullable: true }) yesterdaysAnswer?: string;
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
