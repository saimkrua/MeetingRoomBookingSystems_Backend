const request = require('supertest');
const app = require('../app');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

describe('User API', () => {
    let userToken;

    beforeAll(async () => {
        // Create a sample user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: hashedPassword,
        });
        await user.save();

        // Generate a JWT token for the user
        userToken = jwt.sign({ userId: user._id }, SECRET_KEY);
    });

    afterAll(async () => {
        // Clean up the database
        await User.deleteMany();
        await mongoose.disconnect();
    });

    describe('POST /user/signup', () => {

        it('should sign up a new user', async () => {
            const newUser = {
                username: 'newuser',
                email: 'newuser@example.com',
                password: 'newpassword123',
            };
            const response = await request(app).post('/user/signup').send(newUser);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
            expect(response.body).toHaveProperty('token');
        });

        it('should return 409 status if email already exists', async () => {
            const existingUser = {
                username: 'existinguser',
                email: 'testuser@example.com', // Use the same email as the existing user
                password: 'password123',
            };
            const response = await request(app).post('/user/signup').send(existingUser);
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message', 'Email already exists');
        });

        it('should return 409 status if username already exists', async () => {
            const existingUser = {
                username: 'testuser', // Use the same username as the existing user
                email: 'existingUser@example.com',
                password: 'newpassword123',
            };
            const response = await request(app).post('/user/signup').send(existingUser);
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message', 'Username already exists');
        });
    });

    describe('POST /user/signin', () => {

        it('should sign in a user with valid credentials', async () => {
            const credentials = {
                username: 'testuser',
                password: 'password123',
            };
            const response = await request(app).post('/user/signin').send(credentials);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Sign-in successful');
            expect(response.body).toHaveProperty('token');
        });

        it('should return 401 status if invalid username or password', async () => {
            const credentials = {
                username: 'nonexistentuser', // Use a non-existent username
                password: 'incorrectpassword',
            };
            const response = await request(app).post('/user/signin').send(credentials);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid username or password');
        });

        it('should return 401 status if invalid username or password', async () => {
            const credentials = {
                username: 'testuser',
                password: 'incorrectpassword', // Use incorrect password
            };
            const response = await request(app).post('/user/signin').send(credentials);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid username or password');
        });

    });
});
