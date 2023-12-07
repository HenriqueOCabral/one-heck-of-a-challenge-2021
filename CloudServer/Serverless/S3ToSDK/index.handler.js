const sdk = require("@SDK");
const { v4: uuidv4 } = require("uuid");

const { Video } = new SDK(process.env.sdkId, process.env.sdkSecret);

exports.handler = async (event) => {
  let sdkRes = [];
  const controlId = uuidv4();

  await Video.Uploads.create({
    mp4_support: "standard",
    cors_origin: "*",
    new_asset_settings: {
      playback_policy: "public",
      passthrough: controlId,
    },
  }).then((upload) => {
    sdkRes.push({ videoUrl: upload.url, videoId: controlId });
  });

  const response = {
    statusCode: 200,
    body: sdkRes,
    headers: {
      "Access-Control-Allow-Origin": "domain",
    },
  };
  return response;
};
