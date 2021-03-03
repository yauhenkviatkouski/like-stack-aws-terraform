var AWS = require("aws-sdk");

const localstackMockParameters = process.env.LOCALSTACK_HOSTNAME
  ? {
      endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`,
      region: "eu-west-1",
      accessKeyId: "test",
      secretAccessKey: "test",
    }
  : {};

const dynamo = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  ...localstackMockParameters,
});

exports.handler = function (event, _, callback) {
  event.Records.forEach((record) => {
    const { questionId, subscriber, eventType } = record.messageAttributes;

    const TABLE_NAME = "subscribers_db";

    switch (eventType.stringValue) {
      case "createSubscription":
        const paramsCreate = {
          TableName: TABLE_NAME,
          Item: {
            questionId: {
              S: questionId.stringValue,
            },
            subscribers: {
              SS: [subscriber.stringValue],
            },
          },
        };
        return dynamo.putItem(paramsCreate, callback);
      case "addSubscriber":
        const paramsUpdate = {
          Key: {
            questionId: {
              S: questionId.stringValue,
            },
          },
          TableName: TABLE_NAME,
          ExpressionAttributeNames: {
            "#subscribers": "subscribers",
          },
          ExpressionAttributeValues: {
            ":subscriberId": {
              SS: [subscriber.stringValue],
            },
          },
          UpdateExpression: "ADD #subscribers :subscriberId",
        };
        return dynamo.updateItem(paramsUpdate, callback);
      default:
        return callback(`Unknown operation: ${eventType.stringValue}`);
    }
  });
};
