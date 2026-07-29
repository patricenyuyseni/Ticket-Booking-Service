const { createEventSchema } = require("../validation/eventSchema");
const eventService = require("../services/eventService");

async function createEvent(req, res, next) {
  try {
    const data = createEventSchema.parse(req.body);

    const event = await eventService.createEvent(data);

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createEvent,
};