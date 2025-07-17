import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 3000;

export const companionOptions = {
  providerOptions: {
    dropbox: {
      key: process.env.DROPBOX_APP_KEY,
      secret: process.env.DROPBOX_APP_SECRET,
    },
    drive: {
      key: process.env.GOOGLE_DRIVE_APP_KEY,
      secret: process.env.GOOGLE_DRIVE_APP_SECRET,
    },
  },
  server: {
    host: `localhost:${port}`,
    protocol: "http",
    path: "/companion",
  },
  uploadUrls: [`http://localhost:3000/upload`],
  filePath: `${__dirname}/../uploads`,
  secret: "secret-key",
  streamingUpload: true,
  debug: true,
  corsOrigins: true, // Setting it to true treats any origin as a trusted one
};

export const corsOptions = {
  origin: "*",
  credentials: true,
  allowedHeaders: "*",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
};
