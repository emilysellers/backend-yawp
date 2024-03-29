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

const mockAdmin = {
  firstName: 'admin',
  lastName: 'admin',
  email: 'admin',
  password: '987654',
};

describe('review routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  const registerAndLogin = async () => {
    const agent = request.agent(app);
    const user = await UserService.create(mockUser);
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: mockUser.email, password: mockUser.password });
    return [agent, user];
  };

  it('DELETE /api/v1/reviews/:id deletes review if user is user who created it', async () => {
    const [agent] = await registerAndLogin();
    await agent
      .post('/api/v1/restaurants/1/reviews')
      .send({ stars: 5, detail: 'This is a test review to be deleted' });

    const resp = await agent.delete('/api/v1/reviews/4');
    expect(resp.status).toBe(200);

    const newResp = await agent.get('/api/v1/reviews/4');
    expect(newResp.status).toBe(404);
  });

  it('DELETE /api/v1/reviews/:id deletes review if user is admin', async () => {
    const agent = request.agent(app);
    await UserService.create(mockAdmin);
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: mockAdmin.email, password: mockAdmin.password });

    const adminResp = await agent.delete('/api/v1/reviews/1');
    expect(adminResp.status).toBe(200);

    const newResp = await agent.get('/api/v1/reviews/1');
    expect(newResp.status).toBe(404);
  });
});
