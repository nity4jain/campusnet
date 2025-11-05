# CampusNet Backend - Frontend Integration Guide

**For Frontend Developers**  
**Backend Developer:** Nitya Jain
**Last Updated:** November 5, 2025  
**API Version:** 1.0.0

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Base Configuration](#base-configuration)
3. [Authentication Flow](#authentication-flow)
4. [Code Examples](#code-examples)
5. [React Integration](#react-integration)
6. [Vue.js Integration](#vuejs-integration)
7. [Vanilla JavaScript](#vanilla-javascript)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Base URL

const API_BASE_URL = 'http://localhost:5000';

text

**For production:**
const API_BASE_URL = 'http://<campus-ip>:5000';

text

### Required Headers

All requests need:
headers: {
'Content-Type': 'application/jso
text

Protected routes also need:
headers: {
'Content-Type': 'application/json
, 'AuthoBearer ${token}
text

---

## Base Configuration

### 1. Create API Configuration File

**`src/config/api.js`:**
