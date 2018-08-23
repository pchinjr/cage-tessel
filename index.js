'use strict';

const Tessel = require("tessel-io");
const Server = require("http").Server;
const path = require("path");
const express = require("express");
const five = require("johnny-five");

const app = express();
const server = new Server(app);
const port = 8080;
const io = require("socket.io")(server);

// // Configure express application server:
app.use(express.static(path.join(__dirname, "app")));

// // Start the HTTP Server
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});
server.listen(port);
console.log('Cage Bot is now available to worship at http://192.168.1.101:' + port);

const board = new five.Board({
  io: new Tessel()
});

board.on("ready", () => {
  var light = new five.Light({
    pin: "a7",
    freq: 25
  });

  io.on('connect', socket => {

    socket.on('join', function(data) {
      console.log('worshiper connected');
    });

    light.on("change", function() {
      socket.emit('push', light.level);
      //console.log(light.level); 
    });
  });
});