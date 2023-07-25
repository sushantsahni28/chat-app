const app = require('./app')
const http = require('http')
const db = require('./src/models/sql.models.js')
const { Server } = require("socket.io")
const port = 8000

db.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected to MySql');
});

const server = http.createServer(app)

const io = new Server(server, {
  cors:{
    origin: 'http://localhost:3000',
    },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io",socket.id)

  socket.on("new message",(message, room)=>{
    socket.in(room).emit("message received",message,room)
  })

  socket.on("join room",(room) => {
    socket.join(room)
    console.log("user connected to room "+room)
  })

  socket.on("typing",(room) => {
    socket.in(room).emit("typing",room)
  })

  socket.on("stop typing",(room) => {
    socket.in(room).emit("stop typing",room)
  })
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})