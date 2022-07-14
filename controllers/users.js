const bcrypt = require('bcrypt');
const { response } = require('../app');
const usersRouter = require('express').Router()
const User = require('../models/User');

// ADD A USER
usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });
  
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

usersRouter.get('/', async (_req, res) => {
  const users = await User.find({})
                          .populate('contacts');
  res.json(users);
});

module.exports = usersRouter;