const messageBody = {
  eventType: "createSubscription",
  payload: { questionId: "123", subscriber: "qwe@mail.com" },
};

const event = {
  "Records": [
      {
          "messageId": "f109d653-be2c-4657-8001-cb15cc061817",
          "receiptHandle": "AQEBDrP+pOmkwPf2KhDlonLhKnp0zT+TvrhtuEXlbNUPU9BKbGz5EP80Bl9EulKRS3wGR/g4iTJVJTDiuOezZfBg7yLVp79E3uMSzMEMd8lBkhZl9NNBTc6fNfU9k3/PPikOZeA0WD4fwL6sLikZVhGobqSGneF1zyVMNMcVYW0Ku8D3oFsGARRVFxVIEVvto5NBf56+aMKqdCZ1IPVAlWeNmzMRgj3QXiPLdCCm+2crOYRmmKHPNT3YXctDMkMJGOMVmjK6DQERjLHi1WrfjL1ybZaQX12lyxranGu4o7sCnlelbUDsbB1BfK2pgkDjzaEy8u/bQFv4ZJWUTchbnZbGrORCAzdowKwUYBD8gTNrqA8uBu5e8Blt1yInCZuTkfeLOw/QfWAMJAqfOBHs0Oj2yQ==",
          "body": "{\"eventType\":\"createSubscription\",\"payload\":{\"questionId\":\"123\",\"subscriber\":\"qwe@mail.com\"}}",
          "attributes": {
              "ApproximateReceiveCount": "1",
              "SentTimestamp": "1614585235486",
              "SenderId": "686136373428",
              "ApproximateFirstReceiveTimestamp": "1614585235488"
          },
          "messageAttributes": {
              "questionId": {
                  "stringValue": "123",
                  "stringListValues": [],
                  "binaryListValues": [],
                  "dataType": "String"
              },
              "subscriber": {
                  "stringValue": "qwe@mail.com",
                  "stringListValues": [],
                  "binaryListValues": [],
                  "dataType": "String"
              },
              "eventType": {
                  "stringValue": "createSubscription",
                  "stringListValues": [],
                  "binaryListValues": [],
                  "dataType": "String"
              }
          },
          "md5OfMessageAttributes": "9c794f4ec5562b4a19c6f24162a5bb29",
          "md5OfBody": "a1ebae347b592533945fe96eafadefaf",
          "eventSource": "aws:sqs",
          "eventSourceARN": "arn:aws:sqs:eu-west-1:686136373428:subscribers_queue",
          "awsRegion": "eu-west-1"
      }
  ]
};
