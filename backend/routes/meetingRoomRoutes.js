const express = require('express');
const router = express.Router();
const meetingRoomsController = require("../controller/meetingRoomsController");

router.post("/", meetingRoomsController.createNewMeetingRoom);
router.get("/", meetingRoomsController.getAllMeetingRoom);
router.get("/:roomId", meetingRoomsController.getMeetingRoomDetail);

module.exports = router;






