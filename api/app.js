// 
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');

// require("dotenv").config();
// const mongoose = require("mongoose");
// const port = 9000;
// const app = express();
// const server = http.createServer(app);



// const eventRoute = require("../src/routes/events/event.route.js");
// const userRoute = require("../src/routes/user/user.route.js");
// const orderRoute = require("../src/routes/order/order.route.js");
// const postRoute = require("../src/routes/posts/posts.route.js");


// // middleware
// app.use(express.json());
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000", "http://localhost:3001", "https://event-sphere-bice.vercel.app",
//     ],
//     credentials: true,
//   })
// );
// // SocketIo Middleware
// const io = socketIo(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   pingTimeout: 60000
// });

// // application route

// app.use('/events', eventRoute);
// app.use('/', userRoute);
// app.use('/', orderRoute);
// app.use('/', postRoute)


// //database connection with mongoose  
// // mongodb+srv://<db_username>:<db_password>
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnwtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
// mongoose
//   .connect(uri, { dbName: process.env.DB_NAME })
//   .then(console.log(`connected to mongodb database with mongoose`))
//   .catch((err) => console.error(err));


// // send message to browser
// app.get("/", (req, res) => {
//   res.send("Welcome to Event Sphare app!");
// });

// // all method and all route
// app.all('*', (req, res, next) => {
//   // console.log('all');
//   res.status(404).send({
//     message: "Page not founded 404",
//   })
// })



// let users = {};

// app.use(cors());
// app.use(express.json());

// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'OK', users: Object.keys(users).length });
// });

// io.on('connection', (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on('join', (userName) => {
//     try {
//       if (!userName || typeof userName !== 'string') {
//         socket.emit('error', 'Invalid username');
//         return;
//       }

//       users[socket.id] = {
//         name: userName,
//         inCall: false,
//         socketId: socket.id
//       };

//       console.log(`User ${userName} joined with ID: ${socket.id}`);
//       io.emit('allUsers', users);
//     } catch (error) {
//       console.error('Error in join event:', error);
//       socket.emit('error', 'Failed to join');
//     }
//   });

//   socket.on("callUser", ({ userToCall, signalData, from, name }) => {
//     try {
//       // Check if both users exist
//       if (!users[userToCall]) {
//         socket.emit('error', 'Called user not found');
//         return;
//       }

//       if (!users[from]) {
//         socket.emit('error', 'Caller information not found');
//         return;
//       }

//       // Check if either user is already in a call
//       if (users[userToCall].inCall) {
//         socket.emit('error', 'User is already in a call');
//         return;
//       }

//       if (users[from].inCall) {
//         socket.emit('error', 'You are already in a call');
//         return;
//       }

//       // Update call status
//       users[from].inCall = true;
//       users[userToCall].inCall = true;

//       // Update all users about the new status
//       io.emit('allUsers', users);

//       // Emit call event to the target user
//       io.to(userToCall).emit("callUser", {
//         signal: signalData,
//         from,
//         name: users[from].name
//       });

//       console.log(`Call initiated from ${from} to ${userToCall}`);
//     } catch (error) {
//       console.error('Error in callUser event:', error);
//       socket.emit('error', 'Failed to initiate call');

//       // Reset call states in case of error
//       if (users[from]) users[from].inCall = false;
//       if (users[userToCall]) users[userToCall].inCall = false;
//       io.emit('allUsers', users);
//     }
//   });

//   socket.on("answerCall", ({ to, signal }) => {
//     try {
//       if (!users[to]) {
//         socket.emit('error', 'User not found');
//         return;
//       }

//       io.to(to).emit("callAccepted", signal);
//       console.log(`Call answered by ${socket.id} to ${to}`);
//     } catch (error) {
//       console.error('Error in answerCall event:', error);
//       socket.emit('error', 'Failed to answer call');
//     }
//   });

//   socket.on("iceCandidate", ({ to, candidate }) => {
//     try {
//       if (to && candidate) {
//         io.to(to).emit("iceCandidate", { candidate });
//       }
//     } catch (error) {
//       console.error('Error in iceCandidate event:', error);
//     }
//   });

//   socket.on("endCall", ({ userId }) => {
//     try {
//       if (users[userId]) {
//         users[userId].inCall = false;
//       }
//       if (users[socket.id]) {
//         users[socket.id].inCall = false;
//       }

//       io.to(userId).emit("callEnded");
//       io.emit('allUsers', users);

//       console.log(`Call ended between ${socket.id} and ${userId}`);
//     } catch (error) {
//       console.error('Error in endCall event:', error);
//     }
//   });

//   socket.on('disconnect', () => {
//     try {
//       console.log("User disconnected:", socket.id);

//       // Find any users in call with the disconnected user
//       Object.keys(users).forEach(userId => {
//         if (users[userId].inCall) {
//           io.to(userId).emit("callEnded");
//           users[userId].inCall = false;
//         }
//       });

//       // Remove the disconnected user
//       delete users[socket.id];

//       // Update all clients with new user list
//       io.emit('allUsers', users);
//     } catch (error) {
//       console.error('Error in disconnect event:', error);
//     }
//   });
// });

// // Error handling for the server
// server.on('error', (error) => {
//   console.error('Server error:', error);
// });

// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error);
// });

// process.on('unhandledRejection', (error) => {
//   console.error('Unhandled Rejection:', error);
// });

// // listennig server connection on local pc
// app.listen(port, () => {
//   console.log(`Event Sphare app listening on port ${port}`);
// });

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require("dotenv").config();
const mongoose = require("mongoose");
const port = 9000;
const app = express();
const server = http.createServer(app); // Use server instead of app for listening

// Route imports
const eventRoute = require("../src/routes/events/event.route.js");
const userRoute = require("../src/routes/user/user.route.js");
const orderRoute = require("../src/routes/order/order.route.js");
const postRoute = require("../src/routes/posts/posts.route.js");
const convertation = require("../src/routes/convertation/convertation.route.js");
const message = require("../src/routes/message/message.route.js");
const stats = require("../src/routes/stats/stats.js");

// Middleware
app.use(express.json()); // Remove the duplicate express.json() below
app.use(
  cors({
    origin: [
      "http://localhost:3000", "http://localhost:3001", "https://event-sphere-bice.vercel.app",
    ],
    credentials: true,
  })
);

// Socket.IO Middleware with consistent CORS policy
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000", "http://localhost:3001", "https://event-sphere-bice.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000
});

// Application routes
app.use('/events', eventRoute);
app.use('/', userRoute);
app.use('/', orderRoute);
app.use('/', postRoute);
app.use('/', postRoute)
app.use('/', convertation)
app.use('/', message)
app.use('/', stats)

// Database connection with mongoose
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnwtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
mongoose
  .connect(uri, { dbName: process.env.DB_NAME })
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.error(err));

// Send message to browser
app.get("/", (req, res) => {
  res.send("Welcome to Event Sphere app!");
});

// 404 route
app.all('*', (req, res) => {
  res.status(404).send({
    message: "Page not found - 404",
  });
});

let users = {};

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', users: Object.keys(users).length });
});

// WebSocket events
io.on('connection', (socket) => {
  console.log("User connected:", socket.id);

  socket.on('join', (userName) => {
    if (!userName || typeof userName !== 'string') {
      socket.emit('error', 'Invalid username');
      return;
    }

    users[socket.id] = {
      name: userName,
      inCall: false,
      socketId: socket.id
    };

    io.emit('allUsers', users);
  });

  socket.on("callUser", ({ userToCall, signalData, from }) => {
    if (!users[userToCall] || !users[from]) {
      socket.emit('error', 'User not found');
      return;
    }

    if (users[userToCall].inCall || users[from].inCall) {
      socket.emit('error', 'User is already in a call');
      return;
    }

    users[from].inCall = true;
    users[userToCall].inCall = true;

    io.emit('allUsers', users);

    io.to(userToCall).emit("callUser", {
      signal: signalData,
      from,
      name: users[from].name
    });
  });

  socket.on("answerCall", ({ to, signal }) => {
    if (users[to]) {
      io.to(to).emit("callAccepted", signal);
    }
  });

  socket.on("iceCandidate", ({ to, candidate }) => {
    if (to && candidate) {
      io.to(to).emit("iceCandidate", { candidate });
    }
  });

  socket.on("endCall", ({ userId }) => {
    if (users[userId]) users[userId].inCall = false;
    if (users[socket.id]) users[socket.id].inCall = false;

    io.to(userId).emit("callEnded");
    io.emit('allUsers', users);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('allUsers', users);
  });
});

// Error handling for the server
server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Listening on server instead of app
server.listen(port, () => {
  console.log(`Event Sphere app listening on port ${port}`);
});
