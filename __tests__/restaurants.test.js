const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('restaurant routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });
  it('GET /api/v1/restaurants/:restId returns one existing restaurant', async () => {
    const resp = await request(app).get('/api/v1/restaurants/1');
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({
      id: '1',
      name: "Pip's Original",
      cuisine: 'American',
      cost: 1,
      image:
        'https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg',
      website: 'http://www.PipsOriginal.com',
    });
  });

  it('GET /api/v1/restaurants shows list of all restaurants', async () => {
    const resp = await request(app).get('/api/v1/restaurants');
    expect(resp.status).toBe(200);
    // expect(resp.body).toMatchInlineSnapshot({});
    expect(resp.body[0]).toEqual({
      id: '1',
      name: "Pip's Original",
      cuisine: 'American',
      cost: 1,
      image:
        'https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg',
      website: 'http://www.PipsOriginal.com',
    });
  });
});
