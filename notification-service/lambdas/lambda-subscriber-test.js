var AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  endpoint: "http://localhost:4566",
  region: "eu-west-1",
  accessKeyId: "test",
  secretAccessKey: "test",
});

const sqs = new AWS.SQS({
  apiVersion: "2012-11-05",
  // endpoint: "http://localhost:4566",
  region: "eu-west-1",
  // accessKeyId: "mock_access_key",
  // secretAccessKey: "mock_secret_key",
});

const sqs = new AWS.SNS({
  apiVersion: "2010-03-31",
  region: "eu-west-1",
});

var params = {
  Message: "message text",
  MessageAttributes: {
    questionId: {
      DataType: "String",
      StringValue: "33333",
    },
  },
  TopicArn: "STRING_VALUE",
};

var params = {
  // Remove DelaySeconds parameter and value for FIFO queues
  DelaySeconds: 10,
  MessageAttributes: {
    questionId: {
      DataType: "String",
      StringValue: "33333",
    },
    subscriber: {
      DataType: "String",
      StringValue: "22222@asd.rq",
    },
    eventType: {
      DataType: "String",
      StringValue: "createSubscription",
    },
  },
  MessageBody: "message Body",
  QueueUrl: "http://localhost:4566/000000000000/subscribers_queue",
  // http://localhost:4566/000000000000/subscribers_queue
  // https://sqs.eu-west-1.amazonaws.com/686136373428/subscribers_queue
};

// sqs.sendMessage(params, function (err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.MessageId);
//   }
// });

const handler = async (event, context, callback) => {
  event.Records.forEach(async (record) => {
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
        return dynamo.putItem(paramsCreate, function (err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", data);
          }
        });
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
        return dynamo.updateItem(paramsUpdate, function (err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", data);
          }
        });
      default:
        return "Unknown operation: ${operation}";
    }
  });
};

const sqsMessageEvent = {
  Records: [
    {
      body:
        '{"eventType":"createSubscription","addSubscriber":{"questionId":"123","subscriber":"qwe@mail.com"}}',

      messageAttributes: {
        questionId: {
          stringValue: "123",
        },
        subscriber: {
          stringValue: "qsdas123123@mail.com",
        },
        eventType: {
          stringValue: "createSubscription",
        },
      },
    },
  ],
};

// handler(sqsMessageEvent, null, () => {});

var params = {
  TableName: "subscribers_db",
  Key: {
    questionId: { S: "33333" },
  },
};

// dynamo.getItem(params, function (err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", JSON.stringify(data));
//   }
// });

const caller = async () => {
  const result = await dynamo.getItem(params).promise();
  console.log(
    "🚀 ~ file: lambda-subscriber-test.js ~ line 147 ~ caller ~ result",
    JSON.stringify(result)
  );
};

caller();