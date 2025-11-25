import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findForCourse = async (req, res) => {
    const { courseId } = req.params;
    const list = await dao.findAssignmentsForCourse(courseId);
    res.json(list);
  };

  const createForCourse = async (req, res) => {
    const { courseId } = req.params;
    const a = await dao.createAssignment(courseId, req.body || {});
    res.json(a);
  };

  const updateOne = async (req, res) => {
    const { assignmentId } = req.params;
    const updated = await dao.updateAssignment(assignmentId, req.body || {});
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  };

  const deleteOne = async (req, res) => {
    const { assignmentId } = req.params;
    const status = await dao.deleteAssignment(assignmentId);
    res.send(status);
  };

  const findOne = async (req, res) => {
    const { assignmentId } = req.params;
    const a = await dao.findAssignmentById(assignmentId);
    if (!a) return res.sendStatus(404);
    res.json(a);
  };

  app.get("/api/courses/:courseId/assignments", findForCourse);
  app.post("/api/courses/:courseId/assignments", createForCourse);
  app.get("/api/assignments/:assignmentId", findOne);
  app.put("/api/assignments/:assignmentId", updateOne);
  app.delete("/api/assignments/:assignmentId", deleteOne);
}