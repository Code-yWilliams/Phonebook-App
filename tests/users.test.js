const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app.js');
const api = supertest(app);
const User = require('../models/User');

describe('when there is initially one user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('seekrit', 10);
    const user = new User({ username: 'root', name: 'rooty', passwordHash });
    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'superninjabagel',
      name: 'Mr. Bagel',
      password: 'password24'
    };

    await api.post('/api/users')
             .send(newUser)
             .expect(201)
             .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
  });

  test('creation fails with a username that is already taken', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'root',
      name: 'My username is a duplicate',
      password: 'nonsense'
    }

    const result = await api.post('/api/users')
                            .send(newUser)
                            .expect(400)
                            .expect('Content-Type', /application\/json/);

    console.log(result.body);
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
})