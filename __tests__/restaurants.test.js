const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService.js');

const mockUser = {
  firstName: 'Test',
  lastName: 'Tester',
  email: 'test@test.com',
  password: '987654',
};

describe('restaurant routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('GET /api/v1/restaurants/:restId returns a restaurant with nested reviews', async () => {
    const resp = await request(app).get('/api/v1/restaurants/1');
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Object {
        "cost": 1,
        "cuisine": "American",
        "id": "1",
        "image": "https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg",
        "name": "Pip's Original",
        "reviews": Array [
          Object {
            "detail": "Best restaurant ever!",
            "id": "1",
            "restaurantId": "1",
            "stars": 5,
            "userId": "1",
          },
          Object {
            "detail": "Terrible service :(",
            "id": "2",
            "restaurantId": "1",
            "stars": 1,
            "userId": "2",
          },
          Object {
            "detail": "It was fine.",
            "id": "3",
            "restaurantId": "1",
            "stars": 4,
            "userId": "3",
          },
        ],
        "website": "http://www.PipsOriginal.com",
      }
    `);
  });

  it('GET /api/v1/restaurants shows list of all restaurants', async () => {
    const resp = await request(app).get('/api/v1/restaurants');
    expect(resp.status).toBe(200);
    // expect(resp.body).toMatchInlineSnapshot({});
    expect(resp.body[0]).toEqual({
      id: '1',
      // eslint-disable-next-line quotes
      name: "Pip's Original",
      cuisine: 'American',
      cost: 1,
      image:
        'https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg',
      website: 'http://www.PipsOriginal.com',
    });
  });

  const registerAndLogin = async () => {
    const agent = request.agent(app);
    const user = await UserService.create(mockUser);
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: mockUser.email, password: mockUser.password });
    return [agent, user];
  };

  it('POST /api/v1/restaurants/:id/reviews should create a new review when user is logged in', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent
      .post('/api/v1/restaurants/1/reviews')
      .send({ stars: 4, detail: 'This is new review' });
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Object {
        "detail": "This is new review",
        "id": "4",
        "restaurantId": "1",
        "stars": 4,
        "userId": "4",
      }
    `);
  });
});
