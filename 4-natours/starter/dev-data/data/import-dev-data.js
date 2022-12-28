const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
dotenv.config({ path: `./config.env` });

console.log(`${__dirname}/config.env`);
console.log(process.env.DB);
const DB = process.env.DB.replace('<PASSWORD>', process.env.PWDDB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to the Database');
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Import data Success');
    process.exit();
  } catch {
    console.log('Error on importing Data');
  }
};

// Delete all DATA
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Delete data Success');
    process.exit();
  } catch {
    console.log('Error on deleting Data');
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
