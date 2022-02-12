const redis = require("redis");
const { promisify } = require("util");

const { REDIS_HOST, REDIS_PORT, BUILD_YML_IN_PROGRESS } = process.env;

let redisGet;
let redisSet;

if (!BUILD_YML_IN_PROGRESS) {
  const redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
  });
  redisGet = promisify(redisClient.get).bind(redisClient);
  redisSet = promisify(redisClient.set).bind(redisClient);
}

module.exports = {
  redisSet,
  redisGet
};
