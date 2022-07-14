const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.code);

  if (err.name === 'CastError') {
    return res.status(400).send({ err: 'Malformatted Mongo ID' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ err: err.message });
  } else if (err.code == 11000) {
    return res.status(400).json({ err: 'Username already taken' })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ err: 'Invalid token' });
  } else if (err.name === 'TokenExpiredError') {
    res.status(401).json({ err: 'Token expired' });
    // need to reroute to login
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