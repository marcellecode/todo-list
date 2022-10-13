const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  fs.createReadStream("./public/index.html").pipe(res);

  res.writeHead(200, { "content-type": "text/css" });
  fs.createReadStream("./public/styles.css").pipe(res);
});
const { Server } = require("socket.io");
const io = new Server(server);

const index = "./public/index.html";
let fsWait = false;

io.on("connect", (socket) => {
  fs.watch(index, (event, filename) => {
    if (fsWait) return;
    fsWait = setTimeout(() => {
      fsWait = false;
    }, 100);
    console.log(`${filename} file Changed`);

    socket.emit("connection", true);
  });
});

const indexcss = "./public/styles.css";
let fsWaitCss = false;
io.on("connect", (socket) => {
  fs.watch(indexcss, (event, filename) => {
    if (fsWaitCss) return;
    fsWaitCss = setTimeout(() => {
      fsWaitCss = false;
    }, 100);
    console.log(`${filename} file Changed`);

    socket.emit("connection", true);
  });
});

server.listen(process.env.PORT || 3000);
