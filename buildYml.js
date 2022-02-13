require("dotenv").config();

const fs = require("fs");
const yaml = require("js-yaml");
const {
  API_GATEWAY_FUNCTION_NAME,
  LAMBDA_FUNCTION_NAME,
  AWS_LAMBDA_REGION,
  AWS_LAMBDA_PROFILE,
  AWS_LAMBDA_SECURITY_GROUPS_IDS,
  AWS_LAMBDA_SUBNET_IDS
} = process.env;

const { EventHandler } = require("./utility/eventHandler");

(async () => {
  try {
    let initialYml = fs.readFileSync("./config/initialYml.json", "utf8");
    initialYml = JSON.parse(initialYml);

    const events = Object.getOwnPropertyNames(EventHandler.prototype).filter(
      e => e !== "constructor"
    );

    if (!events.length) {
      throw new Error("No events defined yet");
    }

    if (AWS_LAMBDA_SECURITY_GROUPS_IDS) {
      const securityGroupIds = AWS_LAMBDA_SECURITY_GROUPS_IDS.split(",");
      initialYml.provider.vpc = {
        ...initialYml.provider.vpc,
        securityGroupIds
      };
    }

    if (AWS_LAMBDA_SUBNET_IDS) {
      const subnetIds = AWS_LAMBDA_SUBNET_IDS.split(",");
      initialYml.provider.vpc = {
        ...initialYml.provider.vpc,
        subnetIds
      };
    }

    if (AWS_LAMBDA_REGION) initialYml.provider.region = AWS_LAMBDA_REGION;
    if (AWS_LAMBDA_PROFILE) initialYml.provider.profile = AWS_LAMBDA_PROFILE;
    if (LAMBDA_FUNCTION_NAME) initialYml.service = LAMBDA_FUNCTION_NAME;

    if (API_GATEWAY_FUNCTION_NAME) {
      initialYml.provider.websocketsApiName = API_GATEWAY_FUNCTION_NAME;
      initialYml.functions.connectionHandler.name = API_GATEWAY_FUNCTION_NAME;
    }

    for (let websocketEvent of events) {
      initialYml.functions.connectionHandler.events.push({
        websocket: { route: websocketEvent }
      });
    }

    await fs.writeFileSync("./serverless.yml", yaml.dump(initialYml));

    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
})();
