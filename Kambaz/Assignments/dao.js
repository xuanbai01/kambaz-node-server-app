import model from "./model.js";

export default function AssignmentsDao(db) {
  async function findAssignmentsForCourse(courseId) {
    return await model.find({ course: courseId });
  }

  async function createAssignment(courseId, doc) {
    const assignment = {
      course: courseId,
      title: doc.title ?? "New Assignment",
      description: doc.description ?? "",
      points: Number(doc.points ?? 100),
      due: doc.due ?? null,
      availableFrom: doc.availableFrom ?? null,
      availableUntil: doc.availableUntil ?? null,
    };
    const created = await model.create(assignment);
    return created;
  }

  async function updateAssignment(assignmentId, updates) {
    const assignment = await model.findById(assignmentId);
    if (!assignment) return null;

    assignment.title = updates.title ?? assignment.title;
    assignment.description = updates.description ?? assignment.description;
    assignment.points = updates.points ?? assignment.points;
    assignment.due = updates.due ?? assignment.due;
    assignment.availableFrom =
      updates.availableFrom ?? assignment.availableFrom;
    assignment.availableUntil =
      updates.availableUntil ?? assignment.availableUntil;

    await assignment.save();
    return assignment;
  }

  async function deleteAssignment(assignmentId) {
    const status = await model.deleteOne({ _id: assignmentId });
    return status;
  }

  async function findAssignmentById(assignmentId) {
    const assignment = await model.findById(assignmentId);
    return assignment;
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    findAssignmentById,
  };
}