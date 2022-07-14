const { SECRET } = require('../utils/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/User');
const { response } = require('express');

const nMinutes = (n) => {
  return 60 * n;
}

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  console.log(user);
  const passwordCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!(user && passwordCorrect)) {
    res.status(401).json({ error: 'Invalid username or password' });
  }

  const userForToken = {
    username: user.username,
    userId: user._id
  }

  const token = jwt.sign(userForToken, SECRET, { espiresIn: nMinutes(30) }); // token valid for 30 minutes
  res.status(200)
     .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;