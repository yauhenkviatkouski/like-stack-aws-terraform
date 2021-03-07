const AWS = require("aws-sdk");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

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
      try {
        const snsMessage = JSON.parse(record.body);
        const { questionId } = snsMessage.MessageAttributes;
        const messageText = snsMessage.Message;
        const dbResponse = await dynamo
          .getItem({
            TableName: process.env.SUBSCRIBERS_DB_TABLE_NAME,
            Key: {
              questionId: { S: questionId.Value },
            },
          })
          .promise();
        const questionSubscribers = dbResponse.Item.subscribers.SS;
        process.env.NODE_TLS_REJECT_UNAUTHORIZED === "1";
        const transporter = nodemailer.createTransport(
          smtpTransport({
            service: "gmail",
            auth: {
              user: process.env.SES_ACCESS_KEY,
              pass: process.env.SES_SECRET_KEY,
            },
            host: "smtp.gmail.com",
            port: 587,
          })
        );
        return Promise.allSettled(
          questionSubscribers.map(async (subscriber) => {
            const mailOptions = {
              from: "lsapp.mail@gmail.com",
              to: "kvetkovski@gmail.com",
              subject: "Like-stack questions update",
              text: messageText,
            };

            return await transporter.sendMail(mailOptions);
          })
        );
      } catch (err) {
        console.log("🚀 ~ file: lambda-notifier.js ~ line 59:", err);
        return err;
      }
    })
  );
};
