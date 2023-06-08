const express = require('express');
const router = express.Router();
const bookingsController = require("../controller/bookingsController");

router.get("/available", bookingsController.getAvailableRoom);
router.post("/" , bookingsController.createNewBooking);
router.delete('/:bookingId', bookingsController.cancelBooking);

module.exports = router;






