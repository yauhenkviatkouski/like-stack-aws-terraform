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
  console.log(
    "🚀 ~ file: lambda-notifyer.js ~ line 18 ~ event",
    JSON.stringify(event)
  );
  event.Records.forEach((record) => {
    const { Message } = record.Sns;
    const questionId = record.Sns.MessageAttributes.questionId.Value;

    const TABLE_NAME = "subscribers_db";

    console.log(
      "🚀 ~ file: lambda-notifyer.js ~ line 24 ~ event.Records.forEach ~ Message",
      Message
    );
    console.log(
      "🚀 ~ file: lambda-notifyer.js ~ line 26 ~ event.Records.forEach ~ questionId",
      questionId
    );

    callback(null, "Success");

    // switch (eventType.stringValue) {
    //   case "createSubscription":
    //     const paramsCreate = {
    //       TableName: TABLE_NAME,
    //       Item: {
    //         questionId: {
    //           S: questionId.stringValue,
    //         },
    //         subscribers: {
    //           SS: [subscriber.stringValue],
    //         },
    //       },
    //     };
    //     return dynamo.putItem(paramsCreate, callback);
    //   case "addSubscriber":
    //     const paramsUpdate = {
    //       Key: {
    //         questionId: {
    //           S: questionId.stringValue,
    //         },
    //       },
    //       TableName: TABLE_NAME,
    //       ExpressionAttributeNames: {
    //         "#subscribers": "subscribers",
    //       },
    //       ExpressionAttributeValues: {
    //         ":subscriberId": {
    //           SS: [subscriber.stringValue],
    //         },
    //       },
    //       UpdateExpression: "ADD #subscribers :subscriberId",
    //     };
    //     return dynamo.updateItem(paramsUpdate, callback);
    //   default:
    //     return callback(`Unknown operation: ${eventType.stringValue}`);
    // }
  });
};
