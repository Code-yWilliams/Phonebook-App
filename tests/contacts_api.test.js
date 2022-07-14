const mongoose = require('mongoose');
const helper = require('./test_helper');
const logger = require('../utils/logger');
const supertest = require('supertest');
const app = require('../app.js');
const api = supertest(app);
const Contact = require('../models/Contact');

beforeEach(async () => {
  await Contact.deleteMany({});
  logger.info('Database cleared');
  const promiseArray = helper.initialContacts.map(contact => {
    const contactObject = new Contact(contact);
    return contactObject.save();
  }); 
  await Promise.all(promiseArray); // saving records in a forEach loop will happen in a different execution context, so await won't work
  logger.info('Database seeded');
});

test('contacts are returned as json', async () => {
  await api.get('/api/contacts')
           .expect(200)
           .expect('Content-Type', /application\/json/);
}, 100000); // set long test timeout so the test wont timeout before database interaction is done

test('all contacts are returned', async () => {
  const contacts = await helper.contactsInDb();
  expect(contacts).toHaveLength(helper.initialContacts.length);
});

test('a specific contact is within the returned contacts', async () => {
  const contacts = await helper.contactsInDb();
  const returnedNames = contacts.map(contact => `${contact.firstName} ${contact.lastName}`);
  const initialNames = helper.initialContacts.map(contact => `${contact.firstName} ${contact.lastName}`)
  expect(returnedNames.every(name => initialNames.includes(name))).toBe(true);
});

test('a single specific contact can be viewed', async () => {
  const contacts = await helper.contactsInDb();
  let contactToView = contacts[0];
  const resultContact = await api.get(`/api/contacts/${contactToView.id}`)
                                 .expect(200)
                                 .expect('Content-Type', /application\/json/);

  expect(resultContact.body).toEqual(contactToView);
});

test('a single contact can be deleted', async () => {
  const contactsAtStart = await helper.contactsInDb();
  const contactToDelete = contactsAtStart[0];

  await api.delete(`/api/contacts/${contactToDelete.id}`)
           .expect(200);

  const contactsAtEnd = await helper.contactsInDb();
  expect(contactsAtEnd).toHaveLength(helper.initialContacts.length - 1);
});

test('a valid contact can be added', async () => {
  const newContact = {
    firstName: 'Cody',
    lastName: 'Williams',
    phoneNumber: '(123) 456-7890'
  };

  await api.post('/api/contacts')
           .send(newContact)
           .expect(201)
           .expect('Content-Type', /application\/json/);

  const contacts = await helper.contactsInDb();
  expect(contacts).toHaveLength(helper.initialContacts.length + 1);
  expect(contacts.some(contact => contact.firstName === 'Cody' && contact.lastName === 'Williams')).toBe(true);
});

test('contact without firstName is not added', async () => {
  const newContact = {
    lastName: 'Williams',
    phoneNumber: '(123) 456-7890'
  };

  await api.post('/api/contacts')
           .send(newContact)
           .expect(400);

  const contacts = await helper.contactsInDb();
  expect(contacts).toHaveLength(helper.initialContacts.length);
});

test('contact empty firstName is not added', async () => {
  const newContact = {
    firstName: '',
    lastName: 'Williams',
    phoneNumber: '(123) 456-7890'
  };

  await api.post('/api/contacts')
           .send(newContact)
           .expect(400);

  const contacts = await helper.contactsInDb();
  expect(contacts).toHaveLength(helper.initialContacts.length);
});

test('contact without phoneNumber is not added', async () => {
  const newContact = {
    firstName: 'Cody',
    lastName: 'Williams',
  };

  await api.post('/api/contacts')
           .send(newContact)
           .expect(400);

  const contacts = await helper.contactsInDb();
  expect(contacts).toHaveLength(helper.initialContacts.length);
});

test('contact empty phoneNumber is not added', async () => {
  const newContact = {
    firstName: 'Cody',
    lastName: 'Williams',
    phoneNumber: ''
  };

  await api.post('/api/contacts')
           .send(newContact)
           .expect(400);

  const contacts = await helper.contactsInDb();
  expect(contacts).toHaveLength(helper.initialContacts.length);
});

afterAll(() => {
  mongoose.connection.close();
});