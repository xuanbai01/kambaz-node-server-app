// Kambaz/Assignments/dao.js
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAssignmentsForCourse(courseId) {
    return (db.assignments || []).filter((a) => String(a.course) === String(courseId));
  }

  function createAssignment(courseId, doc) {
    const a = {
      _id: uuidv4(),
      course: courseId,
      title: doc.title ?? "New Assignment",
      description: doc.description ?? "",
      points: Number(doc.points ?? 100),
      due: doc.due ?? null,
      availableFrom: doc.availableFrom ?? null,
      availableUntil: doc.availableUntil ?? null,
    };
    db.assignments = Array.isArray(db.assignments) ? db.assignments : [];
    db.assignments = [...db.assignments, a];
    return a;
  }

  function updateAssignment(assignmentId, updates) {
    const list = db.assignments || [];
    const found = list.find((x) => x._id === assignmentId);
    if (!found) return null;
    Object.assign(found, updates);
    return found;
  }

  function deleteAssignment(assignmentId) {
    db.assignments = (db.assignments || []).filter((x) => x._id !== assignmentId);
    return { status: "ok" };
  }

  function findAssignmentById(assignmentId) {
    return (db.assignments || []).find((x) => x._id === assignmentId) || null;
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    findAssignmentById,
  };
}
