var assert = require("assert");
const { handler } = require("../lambdas/lambda-subscriber");
const event = require("./data.json");

handler(event);

describe("Array", function () {
  describe("#indexOf()", function () {
    it("should return -1 when the value is not present", function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
