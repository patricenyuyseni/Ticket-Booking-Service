import { createEventSchema } from "../validation/eventSchema.js";
import eventService from "../services/eventService.js";


async function createEvent(req, res, next) {
  try {
    const data = createEventSchema.parse(req.body);

    const event = await eventService.createEvent(data);

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
}


async function getEvents(req, res, next) {
  try {
    const after = Number(req.query.after || 0);
    const limit = Number(req.query.limit || 10);

    const events = await eventService.getEvents(after, limit);

    const nextCursor =
      events.length > 0 ? events[events.length - 1].id : null;

    res.status(200).json({
      data: events,
      next_cursor: nextCursor,
    });
  } catch (error) {
    next(error);
  }
}


async function getEventById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      const error = new Error("Invalid event ID");
      error.statusCode = 400;
      throw error;
    }

    const event = await eventService.getEventById(id);

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
}


// Get bookings belonging to one event
async function getEventBookings(req, res, next) {
  try {
    const eventId = Number(req.params.id);
    const after = Number(req.query.after || 0);
    const limit = Number(req.query.limit || 10);

    if (Number.isNaN(eventId)) {
      const error = new Error("Invalid event ID");
      error.statusCode = 400;
      throw error;
    }

    const bookings = await eventService.getEventBookings(
      eventId,
      after,
      limit
    );

    const nextCursor =
      bookings.length > 0
        ? bookings[bookings.length - 1].id
        : null;

    res.status(200).json({
      data: bookings,
      next_cursor: nextCursor,
    });
  } catch (error) {
    next(error);
  }
}


export default {
  createEvent,
  getEvents,
  getEventById,
  getEventBookings,
};