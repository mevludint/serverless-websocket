const AWS = require("aws-sdk");
const { redisSet, redisGet } = require("./redis");
const { API_URL } = process.env;

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
