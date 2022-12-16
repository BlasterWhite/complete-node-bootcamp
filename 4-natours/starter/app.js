const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200);
  res.send('Hello !');
});

app.post('/', (req, res) => {
  res.send('You can not post to this endpoint');
});

const port = 8000;
app.listen(port, () => {
  console.log(`App running on http://127.0.0.1:${port}`);
});
