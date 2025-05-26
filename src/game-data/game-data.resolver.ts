import { Resolver, Query, Args } from '@nestjs/graphql';
import { GameDataService } from './game-data.service';
import { GameInfo, GuessInfo, Clue, AutocompleteResult } from './types';

@Resolver()
export class GameDataResolver {
  constructor(private readonly gameDataService: GameDataService) {}

  @Query(() => GameInfo)
  gameInfo(@Args('game') game: string): Promise<GameInfo> {
    return this.gameDataService.getGameInfo(game);
  }

  @Query(() => GuessInfo)
  guess(
    @Args('game') game: string,
    @Args('word') word: string,
  ): Promise<GuessInfo> {
    return this.gameDataService.guess(game, word);
  }

  @Query(() => Clue)
  clue(@Args('game') game: string, @Args('type') type: string): Promise<Clue> {
    return this.gameDataService.clue(game, type);
  }

  @Query(() => [AutocompleteResult])
  autocomplete(
    @Args('game') game: string,
    @Args('search') search: string,
  ): Promise<AutocompleteResult[]> {
    return this.gameDataService.autocomplete(game, search);
  }
}
