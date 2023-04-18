const express = require('express')
const path = require('path');
const app = express()
const cors = require('cors')
app.use(cors())

app.use(express.json())

app.listen(3003, () => {
  console.log('running on port 3003')
})

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

