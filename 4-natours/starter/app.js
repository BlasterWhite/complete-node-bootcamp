const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');

const app = express();
// 1) MIDDLEWARE
// For request.body

// Security
app.use(helmet());

// Body Parser with a limit of 10kb
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xssClean());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'ratingsAverage',
      'ratingsQuantity',
      'startDates',
      'difficulty',
      'maxGroupSize',
      'name',
      'durationWeeks',
    ],
  })
);

// Serving Static files
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === 'development') {
  console.log('Development MODE');
  app.use(morgan('dev'));
}

// Limiter per IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request for this IP in one Hour !',
});

app.use('/api', limiter);

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
