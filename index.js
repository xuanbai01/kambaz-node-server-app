import express from "express";
import cors from "cors";
import session from "express-session";

import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/Database/index.js";
import UserRoutes, { getCurrentUserRef } from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js"; 
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const SERVER_ENV = process.env.SERVER_ENV || "development";

const allowedOrigins = [
  "http://localhost:3000",
  CLIENT_URL,
  "https://kambaz-next-js-git-a6-xuanbai0110-5999s-projects.vercel.app",
  "https://kambaz-next-js-git-quizzes-xuanbai0110-5999s-projects.vercel.app",
  "https://kambaz-next-js-git-a5-xuanbai0110-5999s-projects.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(
  session({
    secret: "any string",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: SERVER_ENV === "production",
      sameSite: SERVER_ENV === "production" ? "none" : "lax",
     },
  })
);

app.use(express.json());

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db); 
AssignmentsRoutes(app, db); 
EnrollmentsRoutes(app, db, getCurrentUserRef.getCurrentUser);

Lab5(app);
Hello(app);

app.listen(process.env.PORT || 4000);
