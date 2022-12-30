const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    maxlength: [30, 'A user must contain less than 30 character'],
    minlength: [3, 'A user must contain more than 3 character'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
      },
      message: 'The email must be correct',
    },
  },
  photo: {
    type: String,
    default: '#',
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a password confirm'],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: 'The password need to be the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
