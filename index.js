require("dotenv").config();
const { validate } = require("./utility/validators");
const { eventObjectSchema } = require("./validation-schemas/event.schema");
const { EventHandler } = require("./utility/eventHandler");

module.exports.handler = async (event, context) => {
  console.log("Running notifications service");
  console.log("EVENT:", event);
  const EventHandlers = new EventHandler();
  // Init body  for connect or disconnect event
  if (event.body) event.body = JSON.parse(event.body);
  if (!event.body) event.body = { action: "INITIAL", message: {} };

  try {
    await validate(eventObjectSchema, event);
    const { routeKey } = event.requestContext;
    console.log("ROUT KEY: ", routeKey);
    return await EventHandlers[routeKey](event);
  } catch (err) {
    console.error("ERROR: ", err);
    return {};
  }
};
