import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db, getCurrentUser) {
  const dao = EnrollmentsDao(db);

  const requireUser = (req, res) => {
    const user = getCurrentUser?.() || null;
    if (!user) {
      res.status(401).json({ message: "Not signed in" });
      return null;
    }
    return user;
  };

  app.get("/api/users/current/enrollments", (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    res.json(dao.findEnrollmentsForUser(user._id));
  });

  app.post("/api/users/current/enrollments", (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    const { courseId } = req.body || {};
    if (!courseId) return res.status(400).json({ message: "courseId required" });
    const row = dao.enroll(user._id, courseId);
    res.json(row || { status: "already-enrolled" });
  });

  app.delete("/api/users/current/enrollments/:courseId", (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    const { courseId } = req.params;
    const status = dao.unenroll(user._id, courseId);
    res.json(status);
  });

  app.get("/api/courses/:courseId/enrollments", (req, res) => {
    const { courseId } = req.params;
    res.json(dao.findEnrollmentsForCourse(courseId));
  });
}
