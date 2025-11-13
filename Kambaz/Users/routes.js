import UsersDao from "./dao.js";
import CoursesDao from "../Courses/dao.js";

export const getCurrentUserRef = { getCurrentUser: () => null };

export default function UserRoutes(app, db) {
  let currentUser = null;

  const usersDao = UsersDao(db);
  const coursesDao = CoursesDao(db);

  const createUser = (req, res) => {
    try {
      const newUser = usersDao.createUser(req.body || {});
      res.json(newUser);
    } catch (e) {
      res.status(500).json({ message: "Error creating user" });
    }
  };

  const findAllUsers = (req, res) => {
    res.json(usersDao.findAllUsers());
  };

  const findUserById = (req, res) => {
    const { userId } = req.params;
    const user = usersDao.findUserById(userId);
    if (!user) return res.sendStatus(404);
    res.json(user);
  };

  const updateUser = (req, res) => {
    const { userId } = req.params;
    const updates = req.body || {};
    usersDao.updateUser(userId, updates);
    const updated = usersDao.findUserById(userId);
    if (currentUser && updated && currentUser._id === updated._id) {
      currentUser = updated;
      req.session.currentUser = updated;
    }
    res.json(updated);
  };

  const deleteUser = (req, res) => {
    const { userId } = req.params;
    usersDao.deleteUser(userId);
    if (currentUser && currentUser._id === userId) {
      currentUser = null;
      req.session.currentUser = null;
    }
    res.sendStatus(200);
  };

  const signup = (req, res) => {
    const { username } = req.body || {};
    const existing = usersDao.findUserByUsername(username);
    if (existing) {
      return res.status(400).json({ message: "Username already in use" });
    }
    const newUser = usersDao.createUser(req.body || {});
    currentUser = newUser;
    req.session.currentUser = newUser;
    res.json(newUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body || {};
    const user = usersDao.findUserByCredentials(username, password);
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
