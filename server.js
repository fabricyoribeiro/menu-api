const express = require('express')
const path = require('path');
const app = express()
const cors = require('cors')
// const http = require('http');

// const server = http.createServer(app);

const socketIo = require('socket.io');

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

app.use(cors())

// app.use(cors({
//     origin: 'http://localhost:3000'
//   }))
  
app.use(express.json())

const server = app.listen(3003, () => {
  console.log('running on port 3003')
})

const io = socketIo(server)

app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist/', {
  setHeaders: (res, path) => {
    res.setHeader('Content-Type', 'application/javascript');
  }
}));

io.on('connection', (socket) => {
  console.log('Usuário conectado');

  // Envie uma mensagem para o cliente
  socket.broadcast.emit('message', 'Olá, mundo!');

  // Desconexão do socket.io
  // socket.on('disconnect', () => {
  //   console.log('Usuário desconectado');
  // });

  // socket.on('receive', (receive) => {
  //   console.log(receive);
  // });


});



var requests = []

app.get('/requests',async (req, res) => {
  return res.json(requests)
})

app.post('/add', (req, res) => {
  const data = req.body
  console.log(data)
  var status = true
  requests.forEach(request => {
    if(request.num_mesa == data.num_mesa && request.pending){
      status = false
    }
  })
  if(status){
    requests.push(data)
  }
  console.log(requests)
  return res.status(201)
})

app.put('/update', (req, res) => {
  const data = req.body
  requests.forEach((element, index) => {
    console.log(element.num_mesa)
    if (element.num_mesa == data.num_mesa) {
      console.log(requests)
      requests.splice(index, 1)
      requests.push({
        num_mesa: element.num_mesa,
        hour: element.hour,
        minutes: element.minutes,
        pending: false
      })
    }
  })

  return res.json(requests)
})

