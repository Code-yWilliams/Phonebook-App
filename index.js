const express = require('express');
const app = express();

const cors = require('cors');
const morgan = require('morgan');
morgan.token('body', function(req, res) { return JSON.stringify(req.body) });

app.use(cors());
app.use(express.json());
app.use(morgan(':method :url HTTP/:http-version :body'));

let contacts = [
  {
    "firstName": "Cody",
    "lastName": "Williams",
    "phoneNumber": "(818) 795-9614",
    "id": 1
  },
  {
    "firstName": "Corey",
    "lastName": "Ly",
    "phoneNumber": "(800) 800-0000",
    "id": 2
  },
  {
    "firstName": "Sidney",
    "lastName": "Clark",
    "phoneNumber": "(740) 420-6969",
    "id": 3
  }
];

app.get('/', (req, res) => {
  res.send('<h1>Hello, world</h1>')
});

app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

app.get('/info', (req, res) => {
  const contactCount = contacts.length;
  const currentDateTime = new Date().toString()
  res.send(`<h3>Phonebook has info for ${contactCount} people</h3>\n
            <h4>${currentDateTime}</h4>`);
})

app.get('/api/contacts/:id', (req, res) => {
  const id = req.params.id;
  const contact = contacts.find(c => c.id === id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).end()
  }
});

app.put('/api/contacts/:id', (req, res) => {
  const id = Number(req.params.id);
  const contact = req.body;
  contact.id = id;
  contacts = contacts.map(c => c.id === id ? contact : c);
  res.send(contact);
});

app.delete('/api/contacts/:id', (req, res) => {
  const id = req.params.id;
  contacts = contacts.filter(c => c.id !== id);
  res.status(204).end();
});

const nextId = () => contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;

const missingNameAndNumber = (contact) => {
  return (!contact.firstName && !contact.phoneNumber) &&
         (contact.firstName.trim() !== '' && contact.phoneNumber.trim() !== '');
};

const nameAlreadyExists = (contact) => contacts.some(c => {
  return c.firstName.toLowerCase().trim() === contact.firstName.toLowerCase().trim() && 
         c.lastName.toLowerCase().trim() === contact.lastName.toLowerCase().trim();
});

app.post('/api/contacts', (req, res) => {
  console.log(req.body);
  const contact = req.body;

  if (missingNameAndNumber(contact)) {
    return res.status(400).json({ error: "first name and/or phone number missing" });
  } else if (nameAlreadyExists(contact)) {
    return res.status(400).json({ error: `${contact.firstName} ${contact.lastName} already exists.`})
  }

  contact.id = nextId();
  contacts = contacts.concat(contact);
  
  res.json(contact);
});

const unknownRoute = (req, res) => {
  res.status(404).send({ error: 'unknown route' })
}

app.use(unknownRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));
