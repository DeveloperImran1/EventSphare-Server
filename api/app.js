const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require('cors');
const port =  9000;

const eventRoute = require("../src/routes/events/event.route.js");
const userRoute = require("../src/routes/user/user.route.js");
const orderRoute = require("../src/routes/order/order.route.js");
const postRoute = require("../src/routes/posts/posts.route.js");
const convertation = require("../src/routes/convertation/convertation.route.js");
const message = require("../src/routes/message/message.route.js");
const stats = require("../src/routes/stats/stats.js");

// middleware
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000", "http://localhost:3001", "https://event-sphere-bice.vercel.app",
    ],
    credentials: true,
  })
);

// application route
app.use('/events', eventRoute);
app.use('/', userRoute);
app.use('/', orderRoute);
app.use('/', postRoute)
app.use('/', convertation)
app.use('/', message)
app.use('/', stats)

//database connection with mongoose  
// mongodb+srv://<db_username>:<db_password>
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnwtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
mongoose
  .connect(uri, { dbName: process.env.DB_NAME })
  .then(console.log(`connected to mongodb database with mongoose`))
  .catch((err) => console.error(err));


// send message to browser
app.get("/", (req, res) => {
  res.send("Welcome to Event Sphare app!");
});

// all method and all route
app.all('*', (req, res, next) => {
  // console.log('all');
  res.status(404).send({
    message: "Page not founded 404",
  })
})


// listennig server connection on local pc
app.listen(port, () => {
  console.log(`Event Sphare app listening on port ${port}`);
});




