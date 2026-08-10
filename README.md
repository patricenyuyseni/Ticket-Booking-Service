# Ticket Booking Service

A transactional REST API for selling tickets to events with limited capacity.

## Features

- Create events
- List events with keyset pagination
- Get an event by ID
- Create ticket bookings
- List bookings
- List bookings for a specific event
- Get a booking by ID
- Cancel bookings
- Restore seats when a booking is cancelled
- Prevent overselling during concurrent bookings
- Reject bookings for cancelled events
- Validate booking requests with Zod
- SQL injection protection
- PostgreSQL transactions
- OpenAPI/Swagger documentation
- Automated tests

## Tech Stack

- Node.js
- Express
- PostgreSQL
- pg
- Zod
- Swagger/OpenAPI

## Project Structure

```text
src/
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── validation/
├── app.js
└── server.js

sql/
├── schema.sql
└── seed.sql

tests/
├── bookings.test.js
├── concurrency.test.js
├── events.test.js
└── security.test.js

docs/
└── openapi.yaml
