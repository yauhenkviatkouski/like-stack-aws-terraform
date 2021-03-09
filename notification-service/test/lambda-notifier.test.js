var assert = require("assert");
var AWS = require("aws-sdk");

// SNS TopicArn from terraform output-variables file

const mockParams = {
  endpoint: "http://localhost:4566",
  region: "eu-west-1",
  accessKeyId: "test",
  secretAccessKey: "test",
};

const dynamo = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  ...mockParams,
});

const sns = new AWS.SNS({
  apiVersion: "2010-03-31",
  ...mockParams,
});

describe("notification process", function () {
  const getPromiseTimeout = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

  it("should send notification", async function () {
    const QUESTION_ID = "001";
    const SUBSCRIBER_EMAIL = "mock@mail.com";
    const params = {
      TopicArn: "arn:aws:sns:eu-west-1:000000000000:send_notification",
      Message: "mock",
      MessageAttributes: {
        questionId: { DataType: "String", StringValue: QUESTION_ID },
        subscriber: { DataType: "String", StringValue: SUBSCRIBER_EMAIL },
        subscriptionType: {
          DataType: "String",
          StringValue: "createSubscription",
        },
      },
    };
    const publishResponse = await sns.publish(params).promise();
    console.log(
      "🚀 ~ file: lambda-notifyer.test.js ~ line 47 ~ publishResponse",
      publishResponse
    );

    const dbResponse = await dynamo
      .getItem({
        TableName: "subscribers_db",
        Key: {
          questionId: { S: QUESTION_ID },
        },
      })
      .promise();
  });
});
