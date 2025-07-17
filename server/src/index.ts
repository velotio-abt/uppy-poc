import express, { Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import * as companion from "@uppy/companion";
import uploadRoutes from "@/routes/uploadRoutes";
import errorMiddleware from "@/middlewares/errorMiddleware";
import { companionOptions, corsOptions } from "@/config/constants";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'lax',
    secure: false // true if using HTTPS
  }
}));

app.use((req, res, next) => {
  console.log('session id ', req.sessionID)
  console.log('Session:', req.session);
  next();
});

app.use('/companion', companion.app(companionOptions));

// serve static files in uploads folder
app.use("/view_uploads", express.static(path.join(__dirname, "uploads")));

app.use("/upload", uploadRoutes);

app.use(errorMiddleware);

// test route
// app.get("/", (req: Request, res: Response) => {
//   res.send("Server is running...");
// });

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

companion.socket(server);
