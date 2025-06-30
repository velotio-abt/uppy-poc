import express, { Request, Response } from "express";
import session from "express-session"
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import * as companion from "@uppy/companion";
import uploadRoutes from "@/routes/uploadRoutes";
import errorMiddleware from "@/middlewares/errorMiddleware";
import { companionOptions, corsOptions } from "@/config/constants";
import { uploadImage } from "./middlewares/multerCompanionMiddleware";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middlewares

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secret-key",
    resave: true,
    saveUninitialized: true,
}));

console.log(companion, companionOptions)

const { app: companionApp, emitter } = companion.app(companionOptions);

emitter.on("upload-start", ({ token }: any) => {
  function onUploadEvent({ action, payload }: any) {
    console.log("upload action = ", action);
    console.log("upload payload = ", payload);
    if (action === "success") {
      emitter.off(token, onUploadEvent); // avoid listener leak
      console.log("Upload finished", token, payload.url);
    } else if (action === "error") {
      emitter.off(token, onUploadEvent); // avoid listener leak
      console.error("Upload failed", payload);
    }
  }
  emitter.on(token, onUploadEvent);
});

app.use("/companion", companionApp, uploadImage, (req, res) => {
  console.log('companion req ======================++>', req);
  console.log('companion res ======================++>', res);
});

// serve static files in uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/upload", uploadRoutes);

app.use(errorMiddleware);

// test route
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
