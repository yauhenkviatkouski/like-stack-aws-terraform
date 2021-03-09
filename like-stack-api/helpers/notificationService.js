const AWS = require('aws-sdk');
const config = require('config');

const snsParams = {
  region: "eu-west-1",
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
};

if (process.env.NODE_ENV !== "production") {
  snsParams.endpoint = `localstack:4566`;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const sns = new AWS.SNS({
  apiVersion: '2010-03-31',
  ...snsParams,
});

const subscribeToQuestion = async (
  questionId,
  subscriberEmail,
  isAddSubscriber,
  ) => {
    const params = {
    TopicArn: config.SNS_SUBSCRIBERS_TOPIC,
    Message: 'message',
    MessageAttributes: {
      questionId: { DataType: 'String', StringValue: questionId },
      subscriber: { DataType: 'String', StringValue: subscriberEmail },
      subscriptionType: {
        DataType: 'String',
        StringValue: isAddSubscriber ? 'addSubscriber' : 'createSubscription',
      },
    },
  };
  console.log("🚀 ~ file: notificationService.js params '\n\n\n\n\n\n'", params, '\n\n\n\n\n\n', '\n SNS params\n', snsParams)
  const responseSns =  await sns.publish(params).promise();
  return responseSns
};

const notifyAboutAnswer = async (
  questionId,
  questionHeader,
  ) => {
    const params = {
      TopicArn: config.SNS_NOTIFICATIONS_TOPIC,
      Message: `Hello!\nYou are subscribed to question "${questionHeader}".\nSee updates at ${config.CLIENT_URL}/question/${questionId}`,
      MessageAttributes: {
        questionId: { DataType: 'String', StringValue: questionId },
      },
  };
  console.log("🚀 ~ file: notificationService.js params '\n\n\n\n\n\n'", params, '\n\n\n\n\n\n', '\n SNS params\n', snsParams)
  const responseSns =  await sns.publish(params).promise();
  return responseSns
};

module.exports = { subscribeToQuestion, notifyAboutAnswer };
