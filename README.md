# CampusNet Backend - Authentication Module

A secure authentication backend for CampusNet, a campus-only digital repository and networking platform. This module handles user registration, login, profile management, and JWT-based authentication.

**Developed by:** Nitya Jain and Vimedha Chaturvedi
**Date:** November 2025  
**Institution:** Vellore Institute of Technology, AP

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)
- [License](#license)

## Features

- ✅ User registration with email validation
- ✅ Secure password hashing using bcrypt
- ✅ JWT-based authentication
- ✅ Protected routes with token verification
- ✅ User profile management
- ✅ MongoDB database integration
- ✅ RESTful API design
- ✅ Error handling and validation
- ✅ CORS configuration for frontend integration

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18.0.0 or higher - [Download](https://nodejs.org/)
- **MongoDB** v6.0 or higher - [Download](https://www.mongodb.com/try/download/community)
- **npm** v9.0.0 or higher (comes with Node.js)
- **MongoDB Compass** (optional, for database visualization) - [Download](https://www.mongodb.com/products/compass)
- **Postman** (for API testing) - [Download](https://www.postman.com/downloads/)

## Installation

### 1. Clone the Repository

git clone https://github.com/nity4jain/campusnet
cd campusnet-backend

text

### 2. Install Dependencies

npm install

text

This will install:
- `express` - Web framework
- `mongoose` - MongoDB object modeling
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `dotenv` - Environment variable management
- `cors` - Cross-origin resource sharing
- `nodemon` - Development auto-restart (dev dependency)

## Configuration

### 1. Create Environment File

Create a `.env` file in the root directory:

touch .env

text

### 2. Add Environment Variables

Copy and paste the following into your `.env` file:

PORT=5000
MONGO_URI=mongodb://localhost:27017/campusnet
JWT_SECRET=final_year_project_2025_campus_secret_key
NODE_ENV=development

text

**Important:** 
- Change `JWT_SECRET` to a strong, unique secret key
- Never commit `.env` to version control
- For production, use environment-specific values

### 3. Verify .gitignore

Ensure your `.gitignore` includes:

node_modules/
.env
uploads/*

text

## Running the Application

### 1. Start MongoDB

Open a new terminal and start MongoDB:

mongod

text

Keep this terminal running. You should see:
Waiting for connections on port 27017

text

### 2. Start the Backend Server

In a separate terminal, navigate to your project directory and run:

**Development mode (with auto-restart):**
npm run dev

text

**Production mode:**
npm start

text

### 3. Verify Server is Running

You should see:
✅ MongoDB Connected Successfully!
🚀 Server running on http://localhost:5000
📊 Health check: http://localhost:5000/health

text

**Test the health endpoint:**
Open your browser and visit: `http://localhost:5000/health`

Expected response:
{
"status": "Backend is running! 🚀",
"timestamp": "2025-11-05T16:00:00.000Z",
"environment": "development"
}

text

## API Endpoints

### Base URL
http://localhost:5000

text

### Authentication Endpoints

#### 1. Register User
- **Endpoint:** `POST /api/auth/register`
- **Auth Required:** No
- **Headers:** `Content-Type: application/json`
- **Body:**
{
"email": "student@vit.ac.in",
"username": "student1",
"password": "password123",
"full_name": "Student Name"
}

text
- **Success Response:** `201 Created`
{
"success": true,
"message": "User registered successfully",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"user_id": "673abc...",
"email": "student@vit.ac.in",
"username": "student1",
"role": "student"
}
}

text

#### 2. Login User
- **Endpoint:** `POST /api/auth/login`
- **Auth Required:** No
- **Headers:** `Content-Type: application/json`
- **Body:**
{
"email": "student@vit.ac.in",
"password": "password123"
}

text
- **Success Response:** `200 OK`
{
"success": true,
"message": "Login successful",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"user_id": "673abc...",
"email": "student@vit.ac.in",
"username": "student1",
"role": "student",
"department": "Computer Science",
"year": 2
}
}

text

#### 3. Get User Profile
- **Endpoint:** `GET /api/auth/profile`
- **Auth Required:** Yes (Bearer Token)
- **Headers:** `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
{
"success": true,
"user": {
"_id": "673abc...",
"email": "student@vit.ac.in",
"username": "student1",
"full_name": "Student Name",
"department": "Computer Science",
"year": 2,
"role": "student",
"created_at": "2025-11-05T12:00:00.000Z"
}
}

text

#### 4. Update User Profile
- **Endpoint:** `PUT /api/auth/profile`
- **Auth Required:** Yes (Bearer Token)
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body:**
{
"department": "Computer Science",
"year": 3,
"full_name": "Updated Name"
}

text
- **Success Response:** `200 OK`

### Error Responses

- **400 Bad Request** - Missing required fields or validation error
- **401 Unauthorized** - Invalid or missing token
- **409 Conflict** - User already exists (duplicate email/username)
- **500 Internal Server Error** - Server error

## Testing

### Using Postman

1. **Import Collection:**
   - Download Postman
   - Create new collection: "CampusNet Backend"
   - Add requests for each endpoint

2. **Test Flow:**
Step 1: Register new user → Get token
Step 2: Login with user → Get token
Step 3: Get profile (use token from step 1 or 2)
Step 4: Update profile (use token)

text

3. **Sample Test Cases:**
- Register with valid data → Success
- Register with duplicate email → Error 409
- Login with correct password → Success
- Login with wrong password → Error 401
- Get profile without token → Error 401
- Get profile with valid token → Success

### Manual Testing Checklist

- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] Register creates user in database
- [ ] Passwords are hashed (not plain text)
- [ ] Login returns valid JWT token
- [ ] Protected routes reject invalid tokens
- [ ] Profile update saves to database
- [ ] Error messages are clear and helpful

## Project Structure

campusnet-backend/
├── auth/
│ └── routes.js # Authentication endpoints
├── middleware/
│ └── auth.js # JWT verification middleware
├── models/
│ └── User.js # User database schema
├── node_modules/ # Dependencies (not committed)
├── uploads/ # File uploads directory
├── .env # Environment variables (not committed)
├── .gitignore # Git ignore rules
├── package.json # Project dependencies
├── package-lock.json # Locked dependency versions
├── server.js # Main server file
└── README.md # This file

text

## Security Features

### 1. Password Security
- Passwords hashed using **bcrypt** with salt rounds of 10
- Plain text passwords never stored in database
- Passwords never returned in API responses

### 2. JWT Authentication
- Tokens expire in 7 days
- Tokens contain user_id and email (no sensitive data)
- Tokens verified on every protected route request
- Invalid/expired tokens rejected with 401 status

### 3. Input Validation
- Email format validation
- Password minimum length (6 characters)
- Required field validation
- Duplicate email/username checking

### 4. CORS Configuration
- Configured for specific frontend origins
- Credentials allowed for cookie-based auth (future)

### 5. Error Handling
- Generic error messages (don't reveal internal details)
- Proper HTTP status codes
- No stack traces exposed to users

## Troubleshooting

### MongoDB Connection Error
**Problem:** `MongooseError: The uri parameter to openUri() must be a string`

**Solution:** Check `.env` file has correct `MONGO_URI` format without spaces or quotes

### Port Already in Use
**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:** 
Kill process using port 5000
netstat -ano | findstr :5000 # Windows
lsof -i :5000 # Mac/Linux

Or change PORT in .env
text

### Token Invalid Error
**Problem:** `401 Unauthorized - Invalid token`

**Solution:** Register/login again to get a fresh token. Tokens expire after 7 days.

### User Already Exists
**Problem:** `409 Conflict - User already exists`

**Solution:** Use different email/username or login with existing credentials

## Documentation

For more detailed documentation, see:
- **API_CONTRACT.md** - Complete API specification for team integration
- **FRONTEND_INTEGRATION.md** - Frontend integration guide with code examples
- **INTEGRATION_GUIDE.md** - How to integrate with other backend modules

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **dotenv** - Environment management
- **CORS** - Cross-origin support
- **Nodemon** - Development auto-restart

## Future Enhancements

- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting to prevent spam
- [ ] Input validation using Joi
- [ ] Unit tests using Jest
- [ ] API documentation using Swagger
- [ ] Logging using Winston
- [ ] Role-based access control (RBAC)

## Contributing

This is a capstone project for VIT AP. For any queries or issues:
- Contact: [Your Email]
- GitHub Issues: [Your Repo Issues URL]

## License

This project is developed as part of academic coursework at Vellore Institute of Technology, AP.

## Acknowledgments

- VIT AP Faculty: Prof. Nagendra Panini Challa
- Department: Artificial Intelligence & Machine Learning
- Course: Capstone Project (Review-1)
- Date: November 2025





