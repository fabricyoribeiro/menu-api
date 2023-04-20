const express = require('express')
const http = require('http')
// const socketIo = require('socket.io')



const PORT = 4000

const app = express()

app.use(express.json())

const server = http.createServer(app)

server.listen(PORT, () => console.log(`listening server on port ${PORT}`))

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// const io = socketIo(server)

var requests = []

//monitora os requests e envia a lista quando houver alteração
const proxy = new Proxy(requests, {
  set: (target, property, value) => {
    console.log('Um novo elemento foi adicionado ao array!'); 
    io.sockets.emit('request', requests)
    target[property] = value;
    return true;
  }
});



io.on('connection', socket => {
  console.log('Novo usuario conectado')

  io.sockets.emit('request', requests)


  socket.on('request', (data) => {

    var status = true
    requests.forEach(request => {
      if(request.num_mesa == data.num_mesa && request.pending){
        status = false
      }
    })
    if(status){
      proxy.push(data)
    }

    console.log(requests)

  })

  socket.on('update', (num_mesa) => {
    requests.forEach((element, index) => {
      console.log(element.num_mesa)
      if (element.num_mesa == +num_mesa) {
        console.log(requests)
        requests.splice(index, 1)
        proxy.push({
          num_mesa: element.num_mesa,
          hour: element.hour,
          minutes: element.minutes,
          pending: false
        })
      }
    })
  })

  // socket.on('disconnect', () => {
  //   console.log('usuario desconectado')
  // })
})

