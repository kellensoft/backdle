import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('GraphQL (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns gameInfo for "coffeedle"', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            gameInfo(game: "coffeedle") {
              name
              header
              yesterdaysAnswer
              clueTypes {
                clueType
                clueDescription
              }
              games {
                name
                icon
              }
              icon
              background
            }
          }
        `,
      });

    const game = res.body.data.gameInfo;

    expect(res.status).toBe(200);    
    expect(game.name).toBe('Coffeedle');
    expect(game.yesterdaysAnswer).toBeDefined();
    expect(game.icon).toMatch(/^\/static\/coffeedle\/icon\.png$/);
    expect(game.background).toMatch(/^\/static\/coffeedle\/background\.png$/);
    expect(Array.isArray(game.clueTypes)).toBe(true);
    expect(Array.isArray(game.games)).toBe(true);
  });

  it('returns autocomplete results for "ame"', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            autocomplete(game: "coffeedle", search: "ame") {
              name
              image
            }
          }
        `,
      });

    expect(res.status).toBe(200);
    const results = res.body.data.autocomplete;
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain('ame');
    expect(results[0].image).toMatch(/^\/static\/coffeedle\/bank\/.*\.png$/);
  });

  it('returns guess data for "americano"', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            guess(game: "coffeedle", word: "americano") {
              guess
              image
              validation {
                type
                value
                color
                direction
              }
            }
          }
        `,
      });

    expect(res.status).toBe(200);
    const guess = res.body.data.guess;
    expect(guess.guess).toBe('americano');
    expect(guess.image).toMatch(/^\/static\/coffeedle\/bank\/americano\.png$/);
    expect(Array.isArray(guess.validation)).toBe(true);
  });

  it('returns clue for type "Hint"', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            clue(game: "coffeedle", type: "Hint") {
              type
              value
            }
          }
        `,
      });
    
    expect(res.status).toBe(200);
    const clue = res.body.data.clue;
    expect(clue.type).toBe('Hint');
    expect(typeof clue.value).toBe('string');
    expect(clue.value.length).toBeGreaterThan(0);
  });  
});
