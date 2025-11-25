import model from "./model.js";

export default function EnrollmentsDao(db) {

  async function findEnrollmentsForUser(userId) {
    return await model.find({ user: userId });
  }

  async function findEnrollmentsForCourse(courseId) {
    return await model.find({ course: courseId });
  }

  async function enroll(userId, courseId) {
    const existing = await model.findOne({ user: userId, course: courseId });
    if (existing) {
      return existing;
    }
    return await model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,
    });
  }

  function unenroll(userId, courseId) {
    return model.deleteOne({ user: userId, course: courseId });
  }

  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  }

  return {
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    enroll,
    unenroll,
    unenrollAllUsersFromCourse,

    findCoursesForUser,
    findUsersForCourse,

    enrollUserInCourse: enroll,
    unenrollUserFromCourse: unenroll,
  };
}
