const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solution 1
  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) console.error(err);
  //     res.end(data);
  //   });
  //
  // Solution 2
  //   const readAble = fs.createReadStream("test-file.txt");
  //   readAble.on("data", (chuck) => {
  //     res.write(chuck);
  //   });
  //   readAble.on("end", () => {
  //     res.end();
  //   });
  //   readAble.on("error", (err) => {
  //     res.statusCode = 500;
  //     res.end();
  //     console.log(err);
  //   });

  // Solution 3
  const readAble = fs.createReadStream("test-file.txt");
  readAble.pipe(res);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Web server on http://127.0.0.1:8000");
});
