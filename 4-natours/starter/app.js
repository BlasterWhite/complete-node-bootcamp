const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');

const app = express();
// 1) MIDDLEWARE
// For request.body
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === 'development') {
  console.log('Development MODE');
  app.use(morgan('dev'));
}
// 2) ROUTE HANDLER

// USERS

// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);
// 4) SERVER
module.exports = app;
