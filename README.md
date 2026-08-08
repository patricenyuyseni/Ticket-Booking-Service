# Ticket Booking Service

A transactional REST API for selling tickets to events with limited capacity.

## Features

- Create events
- List events
- Get an event by ID
- Create ticket bookings
- List bookings
- Get a booking by ID
- Validate booking requests
- Prevent overselling
- PostgreSQL transactions
- Row-level locking for concurrent bookings
- Customer validation
- OpenAPI documentation
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
