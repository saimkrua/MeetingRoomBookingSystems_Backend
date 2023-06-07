const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'MeetingRoom',
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    bookedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
