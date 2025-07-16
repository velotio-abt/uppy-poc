import express, { Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import * as companion from "@uppy/companion";
import uploadRoutes from "@/routes/uploadRoutes";
import errorMiddleware from "@/middlewares/errorMiddleware";
import { companionOptions, corsOptions } from "@/config/constants";
import { uploadImage } from "@/middlewares/multerCompanionMiddleware";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Setup companion
app.use(cors(corsOptions));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

const { app: companionApp, emitter } = companion.app(companionOptions);

app.use("/companion", companionApp, uploadImage, (req, res) => {
  console.log("debug....", req.body);
});

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files in uploads folder
app.use("/view_uploads", express.static(path.join(__dirname, "uploads")));

app.use("/upload", uploadRoutes);

app.use(errorMiddleware);

// test route
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
