require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

// 1. Create HTTP Server
const server = http.createServer(app);

// 2. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for development
    methods: ["GET", "POST"]
  }
});

// 3. Make 'io' accessible globally so we can emit from routes
app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ A user connected:", socket.id);

  socket.on("join_quiz", (quizId) => {
    socket.join(quizId);
    console.log(`👤 User joined room: ${quizId}`);
  });
});

app.set("io", io);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Real-time Server running on port ${PORT}`);
});