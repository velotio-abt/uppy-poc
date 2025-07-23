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
  uploadUrls: [``],
  filePath: `${__dirname}/../uploads`,
  secret: "secret-key",
  streamingUpload: true,
  debug: true,
  corsOrigins: true, // Setting it to true treats any origin as a trusted one
  tus: {
    endpoint: "<tus server url>/files"
  }
};

export const corsOptions = {
  origin: "*",
  credentials: true,
  allowedHeaders: "*",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
};
