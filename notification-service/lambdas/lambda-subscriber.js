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

exports.handler = async function (event) {
  console.log(
    "🚀 ~ file: lambda-subscriber.js ~ line 18 ~ event",
    JSON.stringify(event)
  );
  return await Promise.all(
    event.Records.map(async (record) => {
      const snsMessage = JSON.parse(record.body);
      const {
        questionId,
        subscriber,
        subscriptionType,
      } = snsMessage.MessageAttributes;

      try {
        const TABLE_NAME = "subscribers_db";
        switch (subscriptionType.Value) {
          case "createSubscription":
            const paramsCreate = {
              TableName: TABLE_NAME,
              Item: {
                questionId: {
                  S: questionId.Value,
                },
                subscribers: {
                  SS: [subscriber.Value],
                },
              },
            };
            const createResponse = await dynamo.putItem(paramsCreate).promise();
            console.log(
              "🚀 ~ file: lambda-subscriber.js ~ line 47 ~ event.Records.map ~ createResponse",
              createResponse
            );
            return createResponse;
          case "addSubscriber":
            const paramsUpdate = {
              Key: {
                questionId: {
                  S: questionId.Value,
                },
              },
              TableName: TABLE_NAME,
              ExpressionAttributeNames: {
                "#subscribers": "subscribers",
              },
              ExpressionAttributeValues: {
                ":subscriberId": {
                  SS: [subscriber.Value],
                },
              },
              UpdateExpression: "ADD #subscribers :subscriberId",
            };
            const updateResponse = await dynamo
              .updateItem(paramsUpdate)
              .promise();
            console.log(
              "🚀 ~ file: lambda-subscriber.js ~ line 70 ~ event.Records.map ~ updateResponse",
              updateResponse
            );
            return updateResponse;
        }
      } catch (err) {
        console.log(
          "🚀 ~ file: lambda-subscriber.js ~ line 73 ~ event.Records.map ~ err",
          err
        );
        return err;
      }
    })
  );
};
