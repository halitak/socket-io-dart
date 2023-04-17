const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
    origin: "*"
  }
});

let hitData;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function hit() {
  const random1 = getRandomIntInclusive(1, 24);
  const random2 = getRandomIntInclusive(1, 3);
  const number =
    random1 <= 20 ? random1 : random1 == 21 ? 25 : random1 == 22 ? 50 : 0;
  const factor = number == 25 || number == 50 ? 1 : random2;
  const total = number * factor;
  return {
    number,
    factor,
    total
  };
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("start", ({ id }) => {
    let i = 1;
    const hitInterval = setInterval(() => {
      i++;
      if (i < 5) {
        hitData = hit();
        io.to(id).emit("hit dart", hitData);
      } else {
        console.log("finished");
        clearInterval(hitInterval);
      }
    }, 3000);
  });

  socket.on("submit email", ({email}) => {
    console.log("submit emaiş: "+email);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
