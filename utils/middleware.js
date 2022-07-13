const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ err: 'Malformatted Mongo ID' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ err: err.message });
  }

  next(err);
};

const unknownRoute = (req, res) => {
  res.status(404).send({ error: 'unknown route' })
};

module.exports = {
  errorHandler,
  unknownRoute,
}