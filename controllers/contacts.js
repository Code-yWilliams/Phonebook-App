const contactsRouter = require('express').Router();
const Contact = require('../models/Contact');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/config');

// GET ALL CONTACTS
contactsRouter.get('/', async (req, res) => {
  const contacts = await Contact.find({})
  res.json(contacts)
});

// GET A SINGLE CONTACT
contactsRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const contact = await Contact.findById(id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).end()
  }
});

// UPDATE A SINGLE CONTACT
contactsRouter.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const updatedContact = req.body;
  const result = await Contact.findByIdAndUpdate(id, updatedContact, { new: true, runValidators: true, context: 'query' }); // options object specifies that returned value should be the updated note instead of old note, and that schema validators should be run
  res.json(result);
});

// DELETE A SINGLE CONTACT
contactsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await Contact.findByIdAndDelete(id)
  if (result) {
    res.status(200).end();
  } else {
    res.status(204).end();
  }
});

const getTokenFrom = (request) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
}

// CREATE A SINGLE CONTACT
contactsRouter.post('/', async (req, res) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, SECRET);
 
  if (!decodedToken.userId) {
    return res.status(401).json({ error: 'invalid or missing token' });
  }

  const user = await User.findById(decodedToken.userId);
  
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    user: user._id // attach user id object to the contact (not just user id string from req body)
  }

  const newContact = new Contact(contact);
  const result = await newContact.save();

  user.contacts = user.contacts.concat(result._id); // add note id object to user's contacts array 
  await user.save();
  res.status(201).json(result);
});

module.exports = contactsRouter;