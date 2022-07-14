if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const PORT = process.env.PORT;
const DB_URI = process.env.NODE_ENV === 'test' ?
               process.env.TEST_MONGO_DB_URI :
               process.env.MONGO_DB_URI;

const SECRET = process.env.SECRET;

module.exports = {
  PORT,
  DB_URI,
  SECRET,
};