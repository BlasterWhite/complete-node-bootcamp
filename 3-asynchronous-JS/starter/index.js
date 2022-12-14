const { rejects } = require('assert');
const fs = require('fs');
const superagent = require('superagent');

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("I couldn't find that file 💩");
      resolve(data);
    });
  });
};

readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed : ${data}`);
  })
  .catch((err) => {
    console.log(err);
  });

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed : ${data}`);
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => {
      console.log(res.body?.message);

      fs.writeFile('dog-img.txt', res.body?.message, (err) => {
        if (err) console.log('Image not saved');
      });
    })
    .catch((err) => {
      console.error(err.message);
    });
});
