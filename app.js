//requiriendo dependencias 
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const app = express()//instancia de express
const server = http.createServer(app)//creando el server con http y express como handle request
const io = socketio(server)//iniciando el server de socket.io
const PORT = 3000  // puerto paara recibir peticiones

app.set('view engine', 'ejs')  // motor de plantillas usado ejs
app.engine('html', require('ejs').renderFile)  // se renderizan los archivos html


app.use(express.static(__dirname + '/public'));//indexando archivos estaticos

//creando el router

app.get('/', function (req, res) {
  res.render(__dirname + "/view/index.html");
});

app.get('/adivina', function (req, res) {
  res.render(__dirname + "/view/adivina.html");
});

app.get('/phaser.js', function (req, res) {
  res.sendFile(__dirname + "/node_modules/phaser/dist/phaser.js");
});

app.get('/socket.io.js', function (req, res) {
  res.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.js");
});

var player0;
var player1;
var in1 = 0;

const connections = [null, null]


io.on('connection', (socket) => {  
  io.emit('actualizar_turno', 0);

    // Find an available player number
    let playerIndex = -1;
    for (const i in connections) {
      if (connections[i] === null) {
        playerIndex = i
        break
      }
    }

    socket.emit('player-number', playerIndex);
    socket.emit('player-number2', playerIndex);
    console.log(`Player ${playerIndex} has connected`);
    if (playerIndex === -1) return

  connections[playerIndex] = false






  //console.log('a user connected');

  //console.log(socket.id);


  socket.on('disconnect', () => {   // usuario desconectado
   // console.log('user disconnected');
   console.log(`Player ${playerIndex} disconnected`)
   connections[playerIndex] = null
  });

  socket.on('lugar', (msg) => {   // lugar de jugador  
    console.log(".");
    console.log(msg); 
    if(parseInt(msg.jugador) ==  '0') {
      player0 = msg.lugar;
      console.log("lugar del juegador 0 "+msg.lugar);
    }else {
     player1 = msg.lugar;
     console.log("lugar del juegador 1 "+msg.lugar);
    }
   });


  socket.on('chat message', (msg) => { // emision broadcast del mensaje recibido
    console.log(msg);
    io.emit('chat message', msg);
  });

  socket.on('click', function (data) { //deteccion de clic para saber que imagen eligió
    io.emit('actualizar_turno', data.jugador);
    console.log(data);
    if(data.jugador == '0') {   
      console.log("aui");
      if(player1 == data.data) {
        io.emit('ganador', data.jugador);
      }
    }else {    
      if(player0 == data.data) {
        io.emit('ganador', data.jugador);
      }
    }    
  });
 

});



server.listen(PORT, () => {  // el servidor se pone en escucha a peticiones
  console.log('listening on ' + PORT)
});