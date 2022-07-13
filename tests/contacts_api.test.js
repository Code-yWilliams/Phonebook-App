const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app.js');

const api = supertest(app);

test('contacts are returned as json', async () => {
  await api.get('/api/contacts')
           .expect(200)
           .expect('Content-Type', /application\/json/);
}, 100000); // set long test timeout so the test wont timeout before database interaction is done

afterAll(() => {
  mongoose.connection.close();
})