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
  return await Promise.allSettled(
    event.Records.map(async (record) => {
      const snsMessage = JSON.parse(record.body);
      const {
        questionId,
        subscriber,
        subscriptionType,
      } = snsMessage.MessageAttributes;

      try {
        const TABLE_NAME = process.env.SUBSCRIBERS_DB_TABLE_NAME;
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
