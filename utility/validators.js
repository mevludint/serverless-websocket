const options = {
  abortEarly: false
};

const validate = (schema, body) => {
  return new Promise((resolve, reject) => {
    if (!schema) {
      const error = new Error("Schema object is required for validation.");
      return reject(error);
    }

    if (!body) {
      const error = new Error("Body object is required for validation.");
      return reject(error);
    }

    const result = schema.validate(body, options);

    if (result.error) {
      const error = result.error.message;
      return reject(error);
    }
    return resolve();
  });
};

module.exports = {
  validate
};
