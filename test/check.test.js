const request = require('supertest');
const app = require('../app'); // adjust path if needed

describe('Simple / route test', () => {
  it('should return 404 for unknown route', async () => {
    await request(app).get('/').expect(404);
  });
});
