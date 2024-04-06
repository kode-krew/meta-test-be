import { SESClient } from '@aws-sdk/client-ses';

export const sesClient = new SESClient({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.REGION,
});
