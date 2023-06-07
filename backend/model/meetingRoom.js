const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingRoomSchema = new Schema({
    name: String,
    capacity: Number,
    bookings: [{
        startTime: Date,
        endTime: Date,
        bookedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
});

const MeetingRoom = mongoose.model('meetingRoom', meetingRoomSchema);

module.exports = MeetingRoom;
