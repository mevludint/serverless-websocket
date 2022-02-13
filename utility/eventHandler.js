require("dotenv").config();

const AWS = require("aws-sdk");
const { redisSet, redisGet } = require("./redis");
const {
  API_URL,
  AWS_LAMBDA_ACCESS_KEY,
  AWS_LAMBDA_SECRET_KEY,
  AWS_LAMBDA_REGION
} = process.env;


AWS.config.update({
  accessKeyId: AWS_LAMBDA_ACCESS_KEY,
  secretAccessKey: AWS_LAMBDA_SECRET_KEY,
  region: AWS_LAMBDA_REGION,
  signatureVersion: "v4"
});


const client = new AWS.ApiGatewayManagementApi({ endpoint: API_URL });

class EventHandler {
  async $connect(event) {
    return {};
  }
  async $disconnect(event) {
    return {};
  }
  async saveConnection(event) {
    const { connectionId, routeKey } = event.requestContext;
    const { message } = event.body;
    await redisSet(message.userId, connectionId);
    return {};
  }

  async sendToOne(event) {
    const { message } = event.body;
    const { recipient, messageBody } = message;

    let recipientId = await redisGet(recipient);
    await client
      .postToConnection({
        ConnectionId: recipientId,
        Data: Buffer.from(JSON.stringify(messageBody))
      })
      .promise();

    return {};
  }
}

module.exports = { EventHandler };
