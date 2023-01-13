const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
      if(allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
}


exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  console.log(req.headers);
  // Send Response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync( async (req, res, next) => {
  if(req.body.password || req.body.passwordConfirm) next(new AppError("You can not provide password information through this endpoint, Please use updateMyPassword", 400));

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterObj(req.body, 'email', 'name'), {new: true, runValidators: true});

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false, desactivateAt: Date.now()});

  res.status(200).json({
    status: "success",
    message: "Your account has been deactivated, It will be delete in 30days"
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'in dev' });
};
exports.setUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'in dev' });
};
exports.updateUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'in dev' });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'in dev' });
};
