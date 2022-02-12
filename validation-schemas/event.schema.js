const Joi = require("@hapi/joi");

const identityObjectSchema = Joi.object().keys({
  userAgent: Joi.string().optional(),
  sourceIp: Joi.string().required()
});

const bodyObjectSchema = Joi.object().keys({
  action: Joi.string().required(),
  message: Joi.object().required()
});

const requestContextObjectSchema = Joi.object().keys({
  routeKey: Joi.string().required(),
  messageId: Joi.string().optional(),
  eventType: Joi.string().required(),
  extendedRequestId: Joi.string().required(),
  requestTime: Joi.string().required(),
  messageDirection: Joi.string().required(),
  stage: Joi.string().required(),
  connectedAt: Joi.number().required(),
  requestTimeEpoch: Joi.number().required(),
  identity: identityObjectSchema.required(),
  requestId: Joi.string().required(),
  domainName: Joi.string().required(),
  connectionId: Joi.string().required(),
  apiId: Joi.string().required()
});

const eventObjectSchema = Joi.object().keys({
  requestContext: requestContextObjectSchema.required(),
  body: bodyObjectSchema.required(),
  headers: Joi.object().optional(),
  multiValueHeaders: Joi.object().optional(),
  isBase64Encoded: Joi.bool().required()
});

module.exports = { eventObjectSchema };
