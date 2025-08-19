import { ObjectType, Field } from '@nestjs/graphql';
import { ExtendsClauseableNode } from 'ts-morph';

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

@ObjectType({ isAbstract: true })
export abstract class SectionStyle {
  @Field({ nullable: true }) padding?: string;
  @Field({ nullable: true }) margin?: string;
  @Field({ nullable: true }) textAlign?: string;

  @Field({ nullable: true }) backgroundColor?: string;
  @Field({ nullable: true }) backgroundImage?: string;
  @Field({ nullable: true }) backgroundSize?: string;
  @Field({ nullable: true }) backgroundRepeat?: string;
  @Field({ nullable: true }) backgroundPosition?: string;

  @Field({ nullable: true }) borderColor?: string;
  @Field({ nullable: true }) borderWidth?: string;
  @Field({ nullable: true }) borderRadius?: string;

  @Field({ nullable: true }) boxShadow?: string;

  @Field({ nullable: true }) fontFamily?: string;
  @Field({ nullable: true }) fontSize?: string;
  @Field({ nullable: true }) fontWeight?: string;
  @Field({ nullable: true }) textColor?: string;

  @Field({ nullable: true }) decorationTopImage?: string;
  @Field({ nullable: true }) decorationTopHeight?: string;
  @Field({ nullable: true }) decorationBottomImage?: string;
  @Field({ nullable: true }) decorationBottomHeight?: string;
}

@ObjectType()
export class TileColors {
  @Field({ nullable: true }) correct?: string;
  @Field({ nullable: true }) incorrect?: string;
  @Field({ nullable: true }) partial?: string;
  @Field({ nullable: true }) default?: string;
}

@ObjectType()
export class TileLabels {
  @Field({ nullable: true }) correct?: string;
  @Field({ nullable: true }) incorrect?: string;
  @Field({ nullable: true }) partial?: string;
  @Field({ nullable: true }) default?: string;
}

@ObjectType()
export class BasicSection extends SectionStyle {}

@ObjectType()
export class TileStyle extends SectionStyle {
  @Field(() => TileColors, { nullable: true }) colors?: TileColors;
  @Field(() => TileLabels, { nullable: true }) labels?: TileLabels;
}

@ObjectType()
export class TableSection extends SectionStyle {
  @Field(() => TileStyle, { nullable: true }) tile?: TileStyle;
}

@ObjectType()
export class YesterdaySection extends SectionStyle {
  @Field(() => BasicSection, { nullable: true }) item?: BasicSection;
}

@ObjectType()
export class Sections {
  @Field(() => BasicSection, { nullable: true }) header?: BasicSection;
  @Field(() => BasicSection, { nullable: true }) menu?: BasicSection;
  @Field(() => BasicSection, { nullable: true }) description?: BasicSection;
  @Field(() => BasicSection, { nullable: true }) input?: BasicSection;
  @Field(() => BasicSection, { nullable: true }) key?: BasicSection;
  @Field(() => BasicSection, { nullable: true }) today?: BasicSection;
  @Field(() => BasicSection, { nullable: true }) share?: BasicSection;
  @Field(() => BasicSection, { nullable: true }) moreGames?: BasicSection;
  @Field(() => BasicSection, { nullable: true }) about?: BasicSection;
  @Field(() => BasicSection, { nullable: true }) modal?: BasicSection;
  @Field(() => TableSection, { nullable: true }) table?: TableSection;
  @Field(() => YesterdaySection, { nullable: true }) yesterday?: YesterdaySection;
}


@ObjectType()
export class GameInfo {
  @Field() name: string;
  @Field() header: string;
  @Field() body: string;
  @Field() placeholder: string;
  @Field(() => [String]) attributes: string[];

  @Field({ nullable: true }) background?: string;
  @Field({ nullable: true }) icon?: string;
  @Field({ nullable: true }) logo?: string; // logo image url

  @Field(() => Sections, { nullable: true }) sections?: Sections;

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
