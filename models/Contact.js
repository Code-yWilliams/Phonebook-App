const config = require('../utils/config');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: 1,
    required: true
  },
  lastName: String,
  phoneNumber: {
    type: String,
    minLength: 1,
    required: true
  }
});

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;