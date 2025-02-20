const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); // Change the secret
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOpt = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  if(process.env.NODE_ENV === 'production') cookieOpt.secure = true;

  res.cookie('jwt', token, cookieOpt);

  //remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    },
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt, // To Suppr
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //  1) Check email & password
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if user exist and is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email and password', 401));
  }

  // 3) Send Token
  createSendToken(user, 200, res);
});

// Middleware to require the JWT Token to pass
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification Token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check the user

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('The user do not longer exist'));
  }
  // 4) Check if user change password after token was given
  if (await freshUser.changePasswordAfter(decoded.iat))
    return next(
      new AppError('User has changed the password, please login again')
    );

  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) return next();
    else
      return next(
        new AppError('The user do not have the permission to do that', 401)
      );
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user base on the token
  const HashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({passwordResetToken: HashToken, passwordResetExpires: { $gt: Date.now()}});

  // 2) If token does experire change the password

  if(!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);

});


exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, newPassword, newPasswordConfirm } = req.body;
  //  1) Check email & password
  if (!passwordCurrent || !newPassword || !newPasswordConfirm) {
    return next(new AppError('Please provide passwordCurrent and a newPassword and a newPasswordConfirm', 400));
  }

  // 2) Check if user exist and is correct
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(passwordCurrent, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();


  createSendToken(user, 200, res);
});
