---
name: Security TODO
about: Track pending security-related improvements like rate limiting or input validation.
title: "[SECURITY] Add rate limiting to sensitive routes"
labels: ["security", "enhancement"]
assignees: Bania1
---

## 🛡️ Description

CodeQL has flagged some authenticated routes as missing rate limiting. This issue tracks the work needed to integrate proper `express-rate-limit` middleware to protect against excessive requests and potential DoS attacks.

## 🔗 Affected Route(s)

- [x] `backend/routes/appointmentsRoutes.js`
  - [x] GET `/appointments/:id`
- [x] `backend/routes/medicalRecordsRoutes.js`
  - [x] GET `/medical-records/`
- [x] `backend/routes/usersRoutes.js`
  - [x] GET `/search`

## 🔧 Suggested Fix

Integrate the `express-rate-limit` middleware. Example setup:

```js
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
```
