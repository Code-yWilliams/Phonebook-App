const mongoose = require('mongoose');
const DB_URI = process.env.MONGO_DB_URI;
console.log(DB_URI);

console.log('Connecting to MongoDB...');
mongoose.connect(DB_URI)
        .then(res => console.log('Connected to MongoDB'))
        .catch(err => console.log('Error connecting to MongoDB:', err.message));

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

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