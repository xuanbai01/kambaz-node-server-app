import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findForCourse = (req, res) => {
    const { courseId } = req.params;
    const list = dao.findAssignmentsForCourse(courseId);
    res.json(list);
  };

  const createForCourse = (req, res) => {
    const { courseId } = req.params;
    const a = dao.createAssignment(courseId, req.body || {});
    res.json(a);
  };

  const updateOne = (req, res) => {
    const { assignmentId } = req.params;
    const updated = dao.updateAssignment(assignmentId, req.body || {});
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  };

  const deleteOne = (req, res) => {
    const { assignmentId } = req.params;
    const status = dao.deleteAssignment(assignmentId);
    res.send(status);
  };

  const findOne = (req, res) => {
    const { assignmentId } = req.params;
    const a = dao.findAssignmentById(assignmentId);
    if (!a) return res.sendStatus(404);
    res.json(a);
  };

  app.get("/api/courses/:courseId/assignments", findForCourse);
  app.post("/api/courses/:courseId/assignments", createForCourse);
  app.get("/api/assignments/:assignmentId", findOne);
  app.put("/api/assignments/:assignmentId", updateOne);
  app.delete("/api/assignments/:assignmentId", deleteOne);
}
