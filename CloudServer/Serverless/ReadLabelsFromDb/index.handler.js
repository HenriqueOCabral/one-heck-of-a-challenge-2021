// Loads in the AWS SDK
const AWS = require("aws-sdk");
require("dotenv").config();

// Creates the document client specifing the region
const ddb = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });

exports.handler = async (event, context, callback) => {
  // Handle promise fulfilled/rejected states
  await readLabels()
    .then((data) => {
      data.Items.forEach(function (item) {
        console.log(item.message);
      });
      callback(null, {
        // If success return 200, and items
        statusCode: 200,
        body: data.Items,
        headers: {
          "Access-Control-Allow-Origin": "domain",
        },
      });
    })
    .catch((err) => {
      // If an error occurs write to the console
      console.error(err);
    });
};

// Function readMessage
// Returns promise
function readLabels() {
  const params = {
    TableName: process.env.TABLE_NAME,
  };
  return ddb.scan(params).promise();
}
