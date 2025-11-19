import UsersDao from "./dao.js";
import CoursesDao from "../Courses/dao.js";

export const getCurrentUserRef = { getCurrentUser: () => null };

export default function UserRoutes(app, db) {
  let currentUser = null;

  const usersDao = UsersDao();
  const coursesDao = CoursesDao(db);

  const createUser = async (req, res) => {
    try {
      const user = await usersDao.createUser(req.body);
      res.json(user);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error creating user" });
    }
  };

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await usersDao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await usersDao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await usersDao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const user = await usersDao.findUserById(req.params.userId);
    res.json(user);
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;

    await usersDao.updateUser(userId, userUpdates);
    const current = req.session["currentUser"];

    if (current && current._id === userId) {
      req.session["currentUser"] = { ...current, ...userUpdates };
    }
    res.json(req.session["currentUser"] || currentUser);
  };

  const deleteUser = async (req, res) => {
    const status = await usersDao.deleteUser(req.params.userId);
    res.json(status);
  };

  const signup = async (req, res) => {
    const { username } = req.body || {};

    const existing = await usersDao.findUserByUsername(username);
    if (existing) {
      return res.status(400).json({ message: "Username already in use" });
    }

    const newUser = await usersDao.createUser(req.body || {});
    currentUser = newUser;
    req.session.currentUser = newUser;
    res.json(newUser);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body || {};
    const user = await usersDao.findUserByCredentials(username, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    currentUser = user;
    req.session.currentUser = user;
    res.json(user);
  };

  const signout = (req, res) => {
    currentUser = null;
    req.session.destroy(() => res.sendStatus(200));
  };

  const profile = (req, res) => {
    const user = req.session.currentUser || currentUser;
    if (!user) return res.sendStatus(401);
    res.json(user);
  };

  const getCurrent = (req, res) => {
    const user = req.session.currentUser || currentUser;
    if (!user) return res.sendStatus(401);
    res.json(user);
  };

  const findMyCourses = (req, res) => {
    const user = req.session.currentUser || currentUser;
    if (!user) return res.sendStatus(401);

    const myCourses = coursesDao.findCoursesForEnrolledUser(user._id);
    res.json(myCourses);
  };

  getCurrentUserRef.getCurrentUser = () => currentUser;

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);

  app.get("/api/users/current", getCurrent);
  app.get("/api/users/current/courses", findMyCourses);
}
