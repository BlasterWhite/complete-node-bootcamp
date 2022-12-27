const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
); // Executed only Once

exports.checkID = (req, res, next, val) => {
  const id = req.params.id * 1; // to convert a String to an array

  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  console.log('Ici' + req.body.price);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({ status: 'failed', message: 'Bad Request' });
  }

  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1; // to convert a String to an array

  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.setTour = (req, res) => {
  //console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1; // to convert a String to an array

  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1; // to convert a String to an array

  const tour = tours.find((el) => el.id === id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
