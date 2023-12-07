import { S3Client } from '@aws-sdk/client-s3';

require('dotenv').config();
// Set the AWS Region.
// e.g. "us-east-1"
const creds = {
  accessId: process.env.ACCESSID,
  secretKey: process.env.SECRETAWS,
  region: process.env.REGION,
  signatureVersion: 'v4'
};
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ creds });
export { s3Client };
