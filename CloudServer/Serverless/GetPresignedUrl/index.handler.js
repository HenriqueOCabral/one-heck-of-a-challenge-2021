require("dotenv").config();
var AWS = require("aws-sdk");
var https = require("https");

let REGION = process.env.REGION;
let ACCESSID = process.env.ACCESSID;
let SECRET = process.env.SECRET_KEY;
let bucketName = process.env.BUCKET_NAME;

var s3 = new AWS.S3({
  accessKeyId: ACCESSID,
  secretAccessKey: SECRET,
  signatureVersion: "v4",
  region: REGION,
});

exports.handler = (event, context, callback) => {
  const jsonStringBody = JSON.parse(JSON.stringify(event));
  if (!jsonStringBody)
    callback(context, {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { headerName: "headerValue" },
      body: JSON.stringify({ received: true, error: "Json invalid key" }),
    });
  const isTypeMasterReady = "video.asset.master.ready";
  if (jsonStringBody.type === isTypeMasterReady) {
    const masterUrl = jsonStringBody.data.master.url.toString();
    const assetId = jsonStringBody.data.id.toString();
    https.get(masterUrl, function (res) {
      var videoData = "";

      res.setEncoding("binary");

      res.on("data", function (chunk) {
        videoData += chunk;
      });

      res.on("end", function () {
        var params = {
          Bucket: bucketName,
          ContentType: "video/mp4",
          Key: `${assetId}.mp4`,
          Body: new Buffer(videoData, "binary"),
          ACL: "public-read",
        };

        s3.putObject(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
            callback(err, {
              statusCode: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "domain",
                "Access-Control-Allow-Credentials": false,
              },
              isBase64Encoded: false,
              body: "error",
            });
          } else console.log(data, "Remaining time: ", context.getRemainingTimeInMillis(), "Function name: ", context.functionName, "Log Stream: ", context.logStreamName);
        }).on("complete", () => {
          console.log("Finished UploadObjectOnS3");
        });
      });

      const response = {
        isBase64Encoded: false,
        statusCode: 200,
        headers: { headerName: "headerValue" },
        body: JSON.stringify({ received: true }),
      };
      callback(null, response);
    });
  } else {
    console.log(
      "Remaining time: ",
      context.getRemainingTimeInMillis(),
      "Function name: ",
      context.functionName,
      "Log Stream: ",
      context.logStreamName
    );
    const returnRes = {
      isBase64Encoded: false,
      statusCode: 403,
      headers: { headerName: "headerValue" },
      body: JSON.stringify({ received: true }),
    };
    callback(null, returnRes);
  }
};
