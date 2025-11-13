import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  const list = () =>
    (db.enrollments = Array.isArray(db.enrollments) ? db.enrollments : []);

  const findEnrollmentsForUser = (userId) =>
    list().filter((e) => String(e.user) === String(userId));

  const isEnrolled = (userId, courseId) =>
    list().some((e) => String(e.user) === String(userId) &&
                       String(e.course) === String(courseId));

  const enroll = (userId, courseId) => {
    if (!isEnrolled(userId, courseId)) {
      const row = { _id: uuidv4(), user: userId, course: courseId };
      db.enrollments = [...list(), row];
      return row;
    }
    return null;
  };

  const unenroll = (userId, courseId) => {
    const before = list().length;
    db.enrollments = list().filter(
      (e) => !(String(e.user) === String(userId) &&
               String(e.course) === String(courseId))
    );
    return { removed: before - db.enrollments.length };
  };

  const findEnrollmentsForCourse = (courseId) =>
    list().filter((e) => String(e.course) === String(courseId));

  return {
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    isEnrolled,
    enroll,
    unenroll,
  };
}
