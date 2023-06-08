const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

// const cors = require("cors");
// const session = require("express-session");

const AppError = require("./utils/appError");
const userRoutes = require("./routes/userRoutes");
const meetingRoomRoutes = require("./routes/meetingRoomRoutes");
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// const sessionOptions = {
//   secret: "my-secret",
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//     // setting this false for http connections
//     secure: false,
//   },
// };

// const corsOptions = {
//   origin: true,
//   credentials: true,
// };

mongoose.connect('mongodb://127.0.0.1:27017/meetingRoomVonder', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

// app.use(express.static("static"));
// app.use(cors(corsOptions));
// app.use(session(sessionOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/meetingRoom", meetingRoomRoutes);
app.use('/booking', bookingRoutes);

app.get("/", (req, res) => {
  res.send("MeetingBooking server is successfully run.");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
