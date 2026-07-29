CREATE TABLE events (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    venue VARCHAR(150) NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity >= 0),
    seats_remaining INTEGER NOT NULL CHECK (seats_remaining >= 0),
    status VARCHAR(12) NOT NULL DEFAULT 'on_sale'
        CHECK (status IN ('on_sale', 'sold_out', 'cancelled'))
);

CREATE TABLE customers (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE bookings (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id),
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status VARCHAR(12) NOT NULL DEFAULT 'confirmed'
        CHECK (status IN ('confirmed', 'cancelled')),
    booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);