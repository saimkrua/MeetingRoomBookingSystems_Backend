# MeetingRoomBookingSystems_Backend
VonderMeetingRoomBookingSystems

## Endpoints

### user API

| Method  | URL	            | Description                                 |
| ------- | --------------- | ------------------------------------------- |  
| POST    | `/user/signup`  | Sign up using username, email, and password |
| POST    | `/user/signin`  | Sign in using username and password         |

### meetingRoom API

| Method  | URL	                    | Description                                       |
| ------- | ----------------------- | ------------------------------------------------- |
| POST    | `/meetingRoom`          | Create a new meeting room with name and capacity  |
| GET     | `/meetingRoom`          | Get all meeting rooms                             |
| GET     | `/meetingRoom/:roomId`  | Get details of a meeting room from roomId         |

### booking API

| Method  | URL	                    | Description                                                       |
| ------- | ----------------------- | ----------------------------------------------------------------- |
| GET     | `/booking/available`    | Get available rooms by querying with startTime and endTime        |
| POST    | `/booking`              | Create a new booking with roomId, startTime, endTime, and userID  |
| DELETE  | `/booking/:bookingId`   | Cancel a booking using the bookingId                              |
