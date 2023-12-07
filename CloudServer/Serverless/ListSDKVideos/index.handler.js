const SDK = require("@sdk");

const sdk = new SDK(
  process.env.sdkId,
  process.env.sdkSecret
);

exports.handler = async (event) => {
  const arr = [];
  const assets = await sdk.Video.Assets.list({
    limit: 100,
    page: 1,
  });

  await assets.forEach((asset, index) => {
    const playbackId = asset.playback_ids?.[0].id.toString();
    const assetId = asset.id.toString();
    const thumb = `linktovideosdk/${playbackId}/thumbnail.png`;
    const videoId = asset.passthrough;

    arr.push({
      id: assetId,
      playback: playbackId,
      image: thumb,
      videoId,
      key: index,
    });
  });

  const response = {
    statusCode: 200,
    body: arr,
    headers: {
      "Access-Control-Allow-Origin": "domain",
    },
  };
  return response;
};
