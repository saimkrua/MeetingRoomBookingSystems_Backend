require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const AppError = require("./utils/appError");

const userRoutes = require("./routes/userRoutes");
const meetingRoomRoutes = require("./routes/meetingRoomRoutes");
const bookingRoutes = require('./routes/bookingRoutes');

mongoose.connect( process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
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
