const request = require('supertest');
const app = require('../app');
const MeetingRoom = require('../model/meetingRoom');
const Booking = require('../model/booking');
const User = require('../model/user');
const mongoose = require('mongoose');

describe('Booking API', () => {

    let testMeetingRoom;
    let nonExistRoomId;
    let testBooking;
    let testBooking_id;
    let testUser;

    beforeAll(async () => {

        // Create a sample user
        testUser = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });
        await testUser.save();

        // Create a sample meeting room
        testMeetingRoom = new MeetingRoom({
            name: 'Test Room',
            capacity: 10,
            bookings: [],
        });
        await testMeetingRoom.save();

        // Create a sample booking
        testBooking = new Booking({
            roomId: testMeetingRoom._id,
            startTime: new Date(),
            endTime: new Date(),
            bookedBy: testUser._id,
        });
        await testBooking.save();
        testBooking_id = testBooking._id;

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

    afterAll(async () => {
        // Clean up the database
        await MeetingRoom.deleteMany();
        await Booking.deleteMany();
        await User.deleteMany();
    });

    describe('GET /booking/available', () => {

        it('should get all available meeting rooms', async () => {
            const response = await request(app).get('/booking/available').query({ startTime: new Date(), endTime: new Date(), });
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });

    });

    describe('POST /booking', () => {

        it('should create a new booking', async () => {
            const newBooking = {
                roomId: testMeetingRoom._id,
                startTime: new Date(),
                endTime: new Date(),
                bookedBy: testUser._id,
            };
            const response = await request(app).post('/booking').send(newBooking);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('roomId', testMeetingRoom._id.toString());
            expect(response.body).toHaveProperty('startTime');
            expect(response.body).toHaveProperty('endTime');
            expect(response.body).toHaveProperty('bookedBy', testUser._id.toString());
        });

        it('should return 404 status if meeting room not found', async () => {
            const newBooking = {
                roomId: nonExistRoomId, // Use a non-existent meeting room ID
                startTime: new Date(),
                endTime: new Date(),
                bookedBy: 'testuser',
            };
            const response = await request(app).post('/booking').send(newBooking);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Meeting room not found');
        });

        it('should return 400 status if room is already booked during the requested time', async () => {
            const overlappingBooking = {
                roomId: testMeetingRoom._id,
                startTime: testBooking.startTime, // Use the same booking time as the existing booking
                endTime: testBooking.endTime,
                bookedBy: testUser._id,
            };
            const response = await request(app).post('/booking').send(overlappingBooking);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'The room is already booked during the requested time');
        });
    });

    describe('DELETE /booking/:bookingId', () => {

        it('should cancel a booking', async () => {
            const response = await request(app).delete(`/booking/${testBooking_id}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Booking canceled successfully');
        });

        it('should return 404 status if booking not found', async () => {
            const response = await request(app).delete(`/booking/${testBooking_id}`); //the one that delete
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Booking not found');
        });

    });
});

describe('availableRoom API', () => {

    let testMeetingRoom1;
    let testMeetingRoom2;
    let testMeetingRoom3;
    let testBooking1;
    let testBooking2;
    let testBooking3;
    let testUser;

    beforeAll(async () => {

        // Create a sample user
        testUser = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });
        await testUser.save();

        // Create a sample meeting room 1
        testMeetingRoom1 = new MeetingRoom({
            name: 'Test Room 1',
            capacity: 10,
            bookings: [{
                "startTime": "2023-06-07T11:00:00.000Z",
                "endTime": "2023-06-07T11:30:00.000Z",
                "bookedBy": testUser._id
            }],
        });
        await testMeetingRoom1.save();

        // Create a sample meeting room 2
        testMeetingRoom2 = new MeetingRoom({
            name: 'Test Room 2',
            capacity: 100,
            bookings: [{
                "startTime": "2023-06-07T13:00:00.000Z",
                "endTime": "2023-06-07T14:30:00.000Z",
                "bookedBy": testUser._id
            }],
        });
        await testMeetingRoom2.save();

        // Create a sample meeting room 3
        testMeetingRoom3 = new MeetingRoom({
            name: 'Test Room 3',
            capacity: 1000,
            bookings: [{
                "startTime": "2023-06-07T12:00:00.000Z",
                "endTime": "2023-06-07T14:00:00.000Z",
                "bookedBy": testUser._id
            }],
        });
        await testMeetingRoom3.save();

        // Create a sample booking 1
        testBooking1 = new Booking({
            roomId: testMeetingRoom1._id,
            startTime: "2023-06-07T11:00:00.000Z",
            endTime: "2023-06-07T11:30:00.000Z",
            bookedBy: testUser._id,
        });
        await testBooking1.save();

        // Create a sample booking 2
        testBooking2 = new Booking({
            roomId: testMeetingRoom2._id,
            startTime: "2023-06-07T13:00:00.000Z",
            endTime: "2023-06-07T14:30:00.000Z",
            bookedBy: testUser._id,
        });
        await testBooking2.save();

        // Create a sample booking 3
        testBooking3 = new Booking({
            roomId: testMeetingRoom3._id,
            startTime: "2023-06-07T12:00:00.000Z",
            endTime: "2023-06-07T14:00:00.000Z",
            bookedBy: testUser._id,
        });
        await testBooking3.save();
    });

    afterAll(async () => {
        // Clean up the database
        await MeetingRoom.deleteMany();
        await Booking.deleteMany();
        await User.deleteMany();
        await mongoose.disconnect();
    });

    describe('GET /booking/available', () => {

        it('should get all available meeting rooms', async () => {
            const response = await request(app)
            .get('/booking/available')
            .query({ startTime: "2023-06-07T10:00:00.000Z", endTime: "2023-06-07T11:00:00.000Z", });

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);
        });

        it('should get all available meeting rooms', async () => {
            const response = await request(app)
            .get('/booking/available')
            .query({ startTime: "2023-06-07T11:00:00.000Z", endTime: "2023-06-07T12:00:00.000Z", });

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
        });

        it('should get all available meeting rooms', async () => {
            const response = await request(app)
            .get('/booking/available')
            .query({ startTime: "2023-06-07T13:30:00.000Z", endTime: "2023-06-07T15:00:00.000Z", });

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
        });

        it('should return an empty array if no meeting rooms are available', async () => {
            const response = await request(app)
            .get('/booking/available')
            .query({ startTime: '2023-06-07T11:00:00.000Z', endTime: '2023-06-07T14:00:00.000Z' });
        
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

    });

});
