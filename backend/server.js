require('dotenv').config();
const app = require('./src/app');
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require('./src/services/ai.service')


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST",],
    allowedHeaders :["Content-Type"],
    credentials: true,
  }
});

const chatHistory = [
  
]

io.on("connection", (socket) => {
  console.log("A user COnnected")

  socket.on("disconnect" , ()=>{
    console.log("A user discooneted")
  })

  socket.on('ai-message',async (data)=>{
    console.log("AI message received" , data)

    chatHistory.push({
      role: "user",
      parts: [{text: data}]
    });
    
    const response = await generateResponse(chatHistory);

    chatHistory.push({
      role: "model",
      parts: [{text: response}]
    });

    socket.emit("ai-message-response", response);
  })
  
});

httpServer.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})