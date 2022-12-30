const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  // Send Response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};
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
