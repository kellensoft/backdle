import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GameDataModule } from './game-data/game-data.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: process.env.RELEASE !== 'production',
      introspection: process.env.RELEASE !== 'production',
    }),
    GameDataModule,
  ],
})
export class AppModule {}
