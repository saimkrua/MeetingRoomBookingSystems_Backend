const request = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');
const MeetingRoom = require('../model/meetingRoom');

describe('Meeting Room API', () => {

    let testMeetingRoom;
    let nonExistRoomId;

    beforeAll(async () => {

        // Create a sample meeting room
        testMeetingRoom = new MeetingRoom({
            name: 'Test Room',
            capacity: 10,
            bookings: [],
        });
        await testMeetingRoom.save();

        // Create a nonExist meeting room Id
        const nonExistMeetingRoom = new MeetingRoom({
            name: 'nonExist Room',
            capacity: 10,
            bookings: [],
        });
        await nonExistMeetingRoom.save();
        nonExistRoomId = nonExistMeetingRoom._id;
        await MeetingRoom.deleteOne({ _id: nonExistRoomId });
    });


    // Clean up the created meeting room after all the test cases
    afterAll(async () => {
        await MeetingRoom.deleteMany();
        await mongoose.disconnect();
    });

    // Test case for creating a new meeting room
    describe('POST /meetingRoom', () => {

        it('should create a new meeting room', async () => {
            const newMeetingRoom = {
                name: 'Meeting Room 1',
                capacity: 10,
            };
            const response = await request(app).post('/meetingRoom').send(newMeetingRoom);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('name', newMeetingRoom.name);
            expect(response.body).toHaveProperty('capacity', newMeetingRoom.capacity);
            createdMeetingRoomId = response.body._id;
        });

    });

    // Test case for getting all meeting rooms
    describe('GET /meetingRoom', () => {

        it('should get all meeting rooms', async () => {
            const response = await request(app).get('/meetingRoom');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('length');
            expect(response.body.length).toBeGreaterThan(0);
        });

    });

    // Test case for getting the detail of a meeting room
    describe('GET /meetingRoom/:roomId', () => {

        it('should get the detail of a meeting room', async () => {
            const response = await request(app).get(`/meetingRoom/${testMeetingRoom._id}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', testMeetingRoom._id.toString());
            expect(response.body).toHaveProperty('name');
            expect(response.body).toHaveProperty('capacity');
        });

        it('should return 404 if the meeting room does not exist', async () => {
            const response = await request(app).get(`/meetingRoom/${nonExistRoomId}`);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Meeting room not found');
        });
    });

});
