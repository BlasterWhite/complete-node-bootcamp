const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');

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

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Can not find ${req.originalUrl}`,
  // });

  next(new AppError(`Can not find ${req.originalUrl}`, 404));
});

app.use(errorController);

// 4) SERVER
module.exports = app;
