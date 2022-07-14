const Contact = require('../models/Contact');
const User = require('../models/User');

const initialContacts = [
  {
    firstName: "Bob",
    lastName: "Bobberson",
    phoneNumber: "(818) 555-5555"
  },
  {
    firstName: "Tina",
    lastName: "Tinerson",
    phoneNumber: "(800) 800-0000"
  }
];

const nonExistingId = async () => {
  const contact = new Contact({
    firstName: 'Test',
    lastName: 'Test',
    phoneNumber: 'Test'
  });
  await contact.save();
  await contact.remove();

  return contact._id.toString();
};

const contactsInDb = async () => {
  const contacts = await Contact.find({});
  return contacts.map(contact => contact.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

module.exports = {
  initialContacts,
  nonExistingId,
  contactsInDb,
  usersInDb,
}