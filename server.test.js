const request = require('supertest');
const app = require('./server');

describe('Car Racing Game API', () => {
  it('GET /health returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /api/scores returns an array', async () => {
    const res = await request(app).get('/api/scores');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/scores adds a score', async () => {
    const res = await request(app)
      .post('/api/scores')
      .send({ name: 'Alice', score: 100, time: 45 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/scores missing fields returns 400', async () => {
    const res = await request(app)
      .post('/api/scores')
      .send({ name: 'Bob', score: 50 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid score data');
  });
});
