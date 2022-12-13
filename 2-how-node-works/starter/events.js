const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
const myEmitter = new Sales();

myEmitter.on("newSale", (name) => {
  console.log(`New sale to ${name}!`);
});

myEmitter.on("newSale", () => {
  console.log("You just make a sale !");
});

myEmitter.emit("newSale", "Johnas");

/////////////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("request received");
  res.end("request received");
});

server.on("listening", (req, res) => {
  console.log("listening");
});

server.on("close", (req, res) => {
  console.log("server closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server web on http://127.0.0.1:8000/");
});
