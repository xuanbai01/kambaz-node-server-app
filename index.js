import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";

import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/Database/index.js";
import UserRoutes, { getCurrentUserRef } from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import QuizzesRoutes from "./Kambaz/Quizzes/routes.js";

dotenv.config();
console.log(
  "DATABASE_CONNECTION_STRING from env:",
  process.env.DATABASE_CONNECTION_STRING
);
const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";
console.log("Final CONNECTION_STRING used by mongoose:", CONNECTION_STRING);

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const SERVER_ENV = process.env.SERVER_ENV || "development";
const isProd =
  SERVER_ENV === "production" || process.env.NODE_ENV === "production";

console.log("CLIENT_URL:", CLIENT_URL);
console.log("SERVER_ENV:", SERVER_ENV);
console.log("isProd:", isProd);

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (
        origin === "http://localhost:3000" ||
        origin === CLIENT_URL
      ) {
        return callback(null, true);
      }
      console.warn("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: "any string",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    },
  })
);

app.use(express.json());

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db, getCurrentUserRef.getCurrentUser);
QuizzesRoutes(app, db);

Lab5(app);
Hello(app);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server listening on port ${process.env.PORT || 4000}`);
});
