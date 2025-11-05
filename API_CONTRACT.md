# CampusNet Backend - API Contract Documentation

**Module:** Authentication Backend  
**Developer:** Nitya Jain 
**Last Updated:** November 5, 2025  
**Version:** 1.0.0  
**Base URL:** `http://localhost:5000`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Common Response Codes](#common-response-codes)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Integration Guide](#integration-guide)
7. [Testing Examples](#testing-examples)

---

## Overview

This document describes the Authentication API for the CampusNet platform. All endpoints follow REST principles and use JSON for request and response payloads.

### Base URL
Development: http://localhost:5000
Production: http://<campus-ip>:5000

text

### Content Type
All requests and responses use:
Content-Type: application/json

text

### Authentication Method
Protected endpoints require **JWT Bearer Token** in the Authorization header:
Authorization: Bearer <token>

text

---

## Authentication Flow

### Flow Diagram
User Registration/Login
↓

Backend validates credentials
↓

Backend generates JWT token (expires in 7 days)
↓

Frontend receives token
↓

Frontend stores token (localStorage/sessionStorage)
↓

Frontend includes token in all protected requests
↓

Backend verifies token on each request
↓

If valid: Process request
If invalid: Return 401 Unauthorized

text

### Token Structure
JWT tokens contain:
- `user_id` - User's MongoDB ObjectId
- `email` - User's email address
- `iat` - Issued at timestamp
- `exp` - Expiration timestamp (7 days from issue)

---

## Common Response Codes

| Status Code | Meaning | When It Occurs |
|-------------|---------|----------------|
| **200** | OK | Successful GET, PUT, DELETE request |
| **201** | Created | Successful POST request (new resource created) |
| **400** | Bad Request | Missing required fields, validation errors |
| **401** | Unauthorized | Invalid/missing token, wrong credentials |
| **404** | Not Found | Resource/endpoint doesn't exist |
| **409** | Conflict | Duplicate resource (email/username exists) |
| **500** | Internal Server Error | Server-side error |

---

## API Endpoints

### 1. Register New User

**Endpoint:** `POST /api/auth/register`

**Description:** Creates a new user account and returns JWT token.

**Authentication Required:** No

**Request Headers:**
Content-Type: application/json

text

**Request Body:**
{
"email": "string (required, unique)",
"username": "string (required, unique)",
"password": "string (required, min 6 characters)",
"full_name": "string (optional)"
}

text

**Example Request:**
{
"email": "student@vit.ac.in",
"username": "student1",
"password": "password123",
"full_name": "Rahul Kumar"
}

text

**Success Response (201 Created):**
{
"success": true,
"message": "User registered successfully",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjczMGFiYzEyMyIsImVtYWlsIjoidGVzdEB2aXQuYWMuaW4iLCJpYXQiOjE3MzA4MjE4MDAsImV4cCI6MTczMTQyNjYwMH0.signature",
"user": {
"user_id": "6730abc123def456",
"email": "student@vit.ac.in",
"username": "student1",
"role": "student"
}
}

text

**Error Responses:**

**400 Bad Request** (Missing fields):
{
"error": "Missing required fields",
"message": "Please provide email, username, and password"
}

text

**400 Bad Request** (Weak password):
{
"error": "Weak password",
"message": "Password must be at least 6 characters"
}

text

**409 Conflict** (User exists):
{
"error": "User already exists",
"message": "Email or username already registered"
}

text

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates user and returns JWT token.

**Authentication Required:** No

**Request Headers:**
Content-Type: application/json

text

**Request Body:**
{
"email": "string (required)",
"password": "string (required)"
}

text

**Example Request:**
{
"email": "student@vit.ac.in",
"password": "password123"
}

text

**Success Response (200 OK):**
{
"success": true,
"message": "Login successful",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"user_id": "6730abc123def456",
"email": "student@vit.ac.in",
"username": "student1",
"role": "student",
"department": "Computer Science",
"year": 2
}
}

text

**Error Responses:**

**400 Bad Request** (Missing credentials):
{
"error": "Missing credentials",
"message": "Please provide email and password"
}

text

**401 Unauthorized** (Invalid credentials):
{
"error": "Invalid credentials",
"message": "Email or password is incorrect"
}

text

---

### 3. Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Description:** Retrieves authenticated user's profile information.

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
Authorization: Bearer <token>

text

**Request Body:** None

**Example Request:**
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

text

**Success Response (200 OK):**
{
"success": true,
"user": {
"_id": "6730abc123def456",
"email": "student@vit.ac.in",
"username": "student1",
"full_name": "Rahul Kumar",
"department": "Computer Science",
"year": 2,
"role": "student",
"is_active": true,
"created_at": "2025-11-05T12:00:00.000Z"
}
}

text

**Error Responses:**

**401 Unauthorized** (No token):
{
"error": "No token provided"
}

text

**401 Unauthorized** (Invalid token):
{
"error": "Invalid token"
}

text

**401 Unauthorized** (Expired token):
{
"error": "Token expired",
"message": "Please login again"
}

text

**404 Not Found** (User doesn't exist):
{
"error": "User not found",
"message": "User profile could not be retrieved"
}

text

---

### 4. Update User Profile

**Endpoint:** `PUT /api/auth/profile`

**Description:** Updates authenticated user's profile information.

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
Authorization: Bearer <token>
Content-Type: application/json

text

**Request Body:**
{
"department": "string (optional)",
"year": "number (optional)",
"full_name": "string (optional)"
}

text

**Example Request:**
{
"department": "Computer Science",
"year": 3,
"full_name": "Rahul Kumar Singh"
}

text

**Success Response (200 OK):**
{
"success": true,
"message": "Profile updated successfully",
"user": {
"_id": "6730abc123def456",
"email": "student@vit.ac.in",
"username": "student1",
"full_name": "Rahul Kumar Singh",
"department": "Computer Science",
"year": 3,
"role": "student",
"is_active": true,
"created_at": "2025-11-05T12:00:00.000Z"
}
}

text

**Error Responses:**

**401 Unauthorized** (No/invalid token):
{
"error": "No token provided"
}

text

---

### 5. Logout (Optional)

**Endpoint:** `POST /api/auth/logout`

**Description:** Invalidates user session. Note: With JWT, logout is primarily handled on the frontend by removing the token. This endpoint exists for consistency.

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
Authorization: Bearer <token>

text

**Success Response (200 OK):**
{
"success": true,
"message": "Logout successful. Please clear the token on frontend."
}

text

---

## Error Handling

### Standard Error Response Format

All error responses follow this structure:

{
"error": "Error type (short)",
"message": "Detailed error message (user-friendly)"
}

text

### Common Error Scenarios

| Scenario | Status | Error Message |
|----------|--------|---------------|
| Missing required fields | 400 | "Missing required fields" |
| Invalid email format | 400 | "Invalid email format" |
| Password too short | 400 | "Password must be at least 6 characters" |
| User already exists | 409 | "User already exists" |
| Invalid login credentials | 401 | "Email or password is incorrect" |
| No token provided | 401 | "No token provided" |
| Invalid token | 401 | "Invalid token" |
| Expired token | 401 | "Token expired" |
| User not found | 404 | "User not found" |
| Server error | 500 | "Server error" |

---

## Integration Guide

### For Frontend Developers

#### 1. Register a User (Frontend Code Example)

async function registerUser(userData) {
try {
const response = await fetch('http://localhost:5000/api/auth/register', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(userData)
});

text
const data = await response.json();

if (response.ok) {
  // Store token
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return { success: true, data };
} else {
  return { success: false, error: data.message };
}
} catch (error) {
console.error('Registration error:', error);
return { success: false, error: 'Network error' };
}
}

// Usage
const result = await registerUser({
email: 'student@vit.ac.in',
username: 'student1',
password: 'password123',
full_name: 'Student Name'
});

text

#### 2. Login a User

async function loginUser(credentials) {
try {
const response = await fetch('http://localhost:5000/api/auth/login', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(credentials)
});

text
const data = await response.json();

if (response.ok) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return { success: true, data };
} else {
  return { success: false, error: data.message };
}
} catch (error) {
return { success: false, error: 'Network error' };
}
}

// Usage
const result = await loginUser({
email: 'student@vit.ac.in',
password: 'password123'
});

text

#### 3. Get User Profile (Protected Route)

async function getUserProfile() {
const token = localStorage.getItem('token');

try {
const response = await fetch('http://localhost:5000/api/auth/profile', {
method: 'GET',
headers: {
'Authorization': Bearer ${token}
}
});

text
const data = await response.json();

if (response.ok) {
  return { success: true, user: data.user };
} else {
  // Token invalid or expired
  if (response.status === 401) {
    localStorage.removeItem('token');
    // Redirect to login
  }
  return { success: false, error: data.error };
}
} catch (error) {
return { success: false, error: 'Network error' };
}
}

text

#### 4. Update User Profile

async function updateProfile(updates) {
const token = localStorage.getItem('token');

try {
const response = await fetch('http://localhost:5000/api/auth/profile', {
method: 'PUT',
headers: {
'Authorization': Bearer ${token},
'Content-Type': 'application/json'
},
body: JSON.stringify(updates)
});

text
const data = await response.json();

if (response.ok) {
  localStorage.setItem('user', JSON.stringify(data.user));
  return { success: true, user: data.user };
} else {
  return { success: false, error: data.message };
}
} catch (error) {
return { success: false, error: 'Network error' };
}
}

// Usage
const result = await updateProfile({
department: 'Computer Science',
year: 3
});

text

---

### For Backend Developers (Resources Module Integration)

#### Using Auth Middleware in Your Routes

// In your resources/routes.js file

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth'); // Import auth middleware

// Public route (no authentication required)
router.get('/resources/public', async (req, res) => {
// Anyone can access this
});

// Protected route (authentication required)
router.post('/resources/upload', verifyToken, async (req, res) => {
// After verifyToken middleware runs:
// req.user_id contains the authenticated user's ID
// req.email contains the authenticated user's email

const uploadedBy = req.user_id; // Use this to track who uploaded

// Your resource upload logic here
const resource = {
title: req.body.title,
uploaded_by: uploadedBy, // Link to user
// ... other fields
};

// Save resource to database
res.status(201).json({ success: true, resource });
});

module.exports = router;

text

#### Accessing User Information in Protected Routes

After the `verifyToken` middleware runs, you have access to:

req.user_id // MongoDB ObjectId of authenticated user (string)
req.email // Email of authenticated user (string)

text

**Example:**

router.get('/resources/my-uploads', verifyToken, async (req, res) => {
// Get all resources uploaded by this user
const resources = await Resource.find({ uploaded_by: req.user_id });
res.json({ resources });
});

text

---

## Testing Examples

### Using cURL

#### Register
curl -X POST http://localhost:5000/api/auth/register
-H "Content-Type: application/json"
-d '{
"email": "test@vit.ac.in",
"username": "testuser",
"password": "password123",
"full_name": "Test User"
}'

text

#### Login
curl -X POST http://localhost:5000/api/auth/login
-H "Content-Type: application/json"
-d '{
"email": "test@vit.ac.in",
"password": "password123"
}'

text

#### Get Profile
curl -X GET http://localhost:5000/api/auth/profile
-H "Authorization: Bearer YOUR_TOKEN_HERE"

text

#### Update Profile
curl -X PUT http://localhost:5000/api/auth/profile
-H "Authorization: Bearer YOUR_TOKEN_HERE"
-H "Content-Type: application/json"
-d '{
"department": "Computer Science",
"year": 3
}'

text

---

## Database Schema Reference

### User Collection

{
_id: ObjectId, // Auto-generated by MongoDB
email: String (unique, required),
username: String (unique, required),
password: String (hashed, required),
full_name: String,
department: String,
year: Number,
role: String (enum: ['student', 'faculty', 'admin']),
is_active: Boolean (default: true),
created_at: Date (default: Date.now)
}

text

**Note:** Passwords are hashed using bcrypt with 10 salt rounds. Never store or transmit plain text passwords.

---

## Security Considerations

1. **Passwords:**
   - Hashed using bcrypt before storage
   - Never returned in API responses
   - Minimum length: 6 characters

2. **JWT Tokens:**
   - Expire in 7 days
   - Stored on client side
   - Must be sent with every protected request
   - Verified on server before processing

3. **CORS:**
   - Configured to allow specific origins
   - In production, update to campus IP/domain

4. **Input Validation:**
   - All required fields validated
   - Email format checked
   - Duplicate users prevented

---

## Support & Contact

For integration issues or questions:

- **Developer:** Nitya Jain
- **Email:** nityajain2402@gmail.com
- **GitHub Issues:** https://github.com/nity4jain/campusnet

---

## Changelog

### Version 1.0.0 (November 5, 2025)
- Initial API release
- Register, Login, Get Profile, Update Profile endpoints
- JWT authentication
- Password hashing with bcrypt

---

**Last Updated:** November 5, 2025  
**API Version:** 1.0.0  
**Status:** Production Ready 