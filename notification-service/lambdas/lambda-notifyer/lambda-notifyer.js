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

const sesAccessKey = "lsapp.mail@gmail.com";
const sesSecretKey = "lsapptest";

exports.handler = async function (event, _, callback) {
  console.log(
    "🚀 ~ file: lambda-notifyer.js ~ line 18 ~ event",
    JSON.stringify(event)
  );

  dynamo.getItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", JSON.stringify(data));
    }
  });

  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      auth: {
        user: sesAccessKey,
        pass: sesSecretKey,
      },
    })
  );
  await Promise.all(
    event.Records.map(async (record) => {
      const { Message } = record.Sns;
      const questionId = record.Sns.MessageAttributes.questionId.Value;

      var text =
        "Email body goes here." +
        "   Message: " +
        Message +
        "   questionId: " +
        questionId;

      var mailOptions = {
        from: "lsapp.mail@gmail.com",
        to: "kvetkovski@gmail.com",
        subject: "Test subject",
        text: text,
      };

      const emailSenderResponse = await transporter.sendMail(mailOptions);

      const TABLE_NAME = "subscribers_db";

      console.log(
        "Success, emailSenderResponse: " + JSON.stringify(emailSenderResponse)
      );

      return (
        null,
        "Success, emailSenderResponse: " + JSON.stringify(emailSenderResponse)
      );
    })
  );
};
