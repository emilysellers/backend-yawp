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

  it('DELETE /api/v1/reviews/:id deletes review if user is admin or user who created it', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.delete('/api/v1/reviews/1');
    expect(resp.status).toBe(200);

    const newResp = await agent.get('/api/v1/reviews/1');
    expect(newResp.status).toBe(404);
    console.log('TEST newResp', newResp.status);
  });
});
