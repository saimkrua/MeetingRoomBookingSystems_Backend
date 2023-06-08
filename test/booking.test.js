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
        await mongoose.disconnect();
    });

    describe('GET /booking/available', () => {

        it('should get all available meeting rooms', async () => {
            const response = await request(app).get('/booking/available').query({startTime: new Date(),endTime: new Date(),});
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
