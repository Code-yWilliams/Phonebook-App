const contactsRouter = require('express').Router()
const Contact = require('../models/Contact')

// GET ALL CONTACTS
contactsRouter.get('/', (req, res, next) => {
  Contact.find({})
              .then(contacts => res.json(contacts))
              .catch(err => next(err));
});

// GET A SINGLE CONTACT
contactsRouter.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Contact.findById(id)
              .then(contact => {
                if (contact) {
                  res.json(contact);
                } else {
                  res.status(404).end()
                }
              })
              .catch(err => next(err));
});

// UPDATE A SINGLE CONTACT
contactsRouter.put('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const updatedContact = req.body;
  Contact.findByIdAndUpdate(id, updatedContact, { new: true, runValidators: true, context: 'query' }) // options object specifies that returned value should be the updated note instead of old note, and that schema validators should be run
         .then(result => res.json(result))
         .catch(err => next(err));
});

// DELETE A SINGLE CONTACT
contactsRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Contact.findByIdAndDelete(id)
         .then(result => {
           if (result) {
             res.status(200).end();
           } else {
             res.status(204).end();
           }
         })
         .catch(err => next(err));
});

// CREATE A SINGLE CONTACT
contactsRouter.post('/', (req, res, next) => {
  const contact = req.body;
  const newContact = new Contact(contact);
  newContact.save()
            .then(result => {
              res.json(result);
            })
            .catch(err => next(err));
});

module.exports = contactsRouter;