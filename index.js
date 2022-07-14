const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  fs.createReadStream("./public/index.html").pipe(res);
});
const { Server } = require("socket.io");
const io = new Server(server);

//testando o watch do node
const index = "./public/index.html";
let fsWait = false;

io.on("connection", (socket) => {
  // console.log(updatePage);
  fs.watch(index, (event, filename) => {
    if (fsWait) return;
    fsWait = setTimeout(() => {
      fsWait = false;
    }, 100);
    console.log(`${filename} file Changed`);

    socket.emit("conexao", true);
  });
});

server.listen(process.env.PORT || 3000);
