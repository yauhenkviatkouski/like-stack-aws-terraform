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

describe("subscription process", async function () {
  const getPromiseTimeout = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });

  it("should add new question & subscriber to DB", async function () {
    const QUESTION_ID = "001";
    const SUBSCRIBER_EMAIL = "mock@mail.com";
    const params = {
      TopicArn: "arn:aws:sns:eu-west-1:000000000000:subscribe_to_question",
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
    await sns.publish(params).promise();

    const timeout = getPromiseTimeout();
    await timeout;

    const dbResponse = await dynamo
      .getItem({
        TableName: "subscribers_db",
        Key: {
          questionId: { S: QUESTION_ID },
        },
      })
      .promise();

    assert.strictEqual(
      dbResponse.Item.subscribers.SS.includes(SUBSCRIBER_EMAIL),
      true
    );
  });

  it("should add subscriber to existing question in DB", async function () {
    const QUESTION_ID = "001";
    const SUBSCRIBER_EMAIL = "newSubscriber@mail.com";
    const params = {
      TopicArn: "arn:aws:sns:eu-west-1:000000000000:subscribe_to_question",
      Message: "mock",
      MessageAttributes: {
        questionId: { DataType: "String", StringValue: QUESTION_ID },
        subscriber: { DataType: "String", StringValue: SUBSCRIBER_EMAIL },
        subscriptionType: {
          DataType: "String",
          StringValue: "addSubscriber",
        },
      },
    };
    await sns.publish(params).promise();

    const timeout = getPromiseTimeout();
    await timeout;

    const dbResponse = await dynamo
      .getItem({
        TableName: "subscribers_db",
        Key: {
          questionId: { S: QUESTION_ID },
        },
      })
      .promise();

    assert.strictEqual(
      dbResponse.Item.subscribers.SS.includes(SUBSCRIBER_EMAIL),
      true
    );
  });
});
