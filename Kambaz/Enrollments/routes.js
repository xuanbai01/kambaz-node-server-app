import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db, getCurrentUser) {
  const dao = EnrollmentsDao(db);

  const requireUser = (req, res) => {
    const user = req.session?.currentUser || getCurrentUser?.() || null;
    if (!user) {
      res.status(401).json({ message: "Not signed in" });
      return null;
    }
    return user;
  };

  app.get("/api/users/current/enrollments", async (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    const rows = await dao.findEnrollmentsForUser(user._id);
    res.json(rows);
  });

  app.post("/api/users/current/enrollments", async (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    const { courseId } = req.body || {};
    if (!courseId) {
      return res.status(400).json({ message: "courseId required" });
    }
    const row = await dao.enroll(user._id, courseId);
    res.json(row || { status: "already-enrolled" });
  });

  app.delete("/api/users/current/enrollments/:courseId", async (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    const { courseId } = req.params;
    const status = await dao.unenroll(user._id, courseId);
    res.json(status);
  });

  app.get("/api/courses/:courseId/enrollments", async (req, res) => {
    const { courseId } = req.params;
    const rows = await dao.findEnrollmentsForCourse(courseId);
    res.json(rows);
  });
}
