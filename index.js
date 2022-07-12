const express = require('express');
const app = express();
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
console.log(process.env.NODE_ENV)

// IMPORT MONGODB MODEL(S)
const ContactModel = require('./models/note');

// EXPRESS MIDDLEWARE
const cors = require('cors');
const morgan = require('morgan');
morgan.token('body', function(req, res) { return JSON.stringify(req.body) });

app.use(cors()); // enable CORS
app.use(express.static('build')); // serve static files from build directory if request matches one of its files
app.use(express.json()); // parse HTTP request bodies into JSON, attach to body property on request objects
app.use(morgan(':method :url HTTP/:http-version :body')); // log all http request info to std out

// GET ALL CONTACTS
app.get('/api/contacts', (req, res, next) => {
  ContactModel.find({})
              .then(contacts => res.json(contacts))
              .catch(err => next(err));
});

// GET A SINGLE CONTACT
app.get('/api/contacts/:id', (req, res, next) => {
  const id = req.params.id;
  ContactModel.findById(id)
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
app.put('/api/contacts/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const updatedContact = req.body;
  ContactModel.findByIdAndUpdate(id, updatedContact, { new: true, runValidators: true, context: 'query' }) // options object specifies that returned value should be the updated note instead of old note, and that schema validators should be run
              .then(result => res.json(result))
              .catch(err => next(err));
});

// DELETE A SINGLE CONTACT
app.delete('/api/contacts/:id', (req, res, next) => {
  const id = req.params.id;
  ContactModel.findByIdAndDelete(id)
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
app.post('/api/contacts', (req, res, next) => {
  const contact = req.body;
  const newContact = new ContactModel(contact);
  newContact.save()
            .then(result => {
              res.json(result);
            })
            .catch(err => next(err));
});

// MIDDLEWARE: HANDLE AN UNKNOWN ENDPOINT / ROUTE
const unknownRoute = (req, res) => res.status(404).send({ error: 'unknown route' });
app.use(unknownRoute);

// MIDDLEWARE: ERROR HANDLER
const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ err: 'Malformatted Mongo ID' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ err: err.message });
  }

  next(err);
}
app.use(errorHandler);

// START WEB SERVER
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

