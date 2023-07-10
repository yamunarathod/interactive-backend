const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const port = 8000;
const http = require("http");
const server = http.createServer();
const sp = new SerialPort({ path: "COM9", baudRate: 115200 });
var parser = sp.pipe(new ReadlineParser({ delimiter: "\r\n" }));
var i = 0;
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use(cors({ origin: "*" }));

const io = new Server(server);
io.on("connection", (socket) => {
  console.log("Client is connected");
  parser.on("data", (data) => {
    console.log(data);
    io.emit("videoNumber", data);
  });
});
server.listen(port, () => {
  console.log("Server started", port);
});

// const io = new Server();

// io.on("connection", (socket) => {
//   console.log("Socket connected");

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected");
//   });
// });

// parser.on("data", (data) => {
//   console.log("Received serial data:", data);

//   io.emit("serialData", data);
// });

// port.on("open", () => {
//   console.log("Serial port connected");
// });

// port.on("error", (err) => {
//   console.error("Serial port error:", err.message);
// });

// module.exports = io;
