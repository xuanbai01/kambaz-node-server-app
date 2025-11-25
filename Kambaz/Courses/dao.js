import model from "./model.js";

export default function CourseDao(db) {
  const findAllCourses = async () => {
    return await model.find();
  };

  const findCourseById = async (courseId) => {
    return await model.findById(courseId);
  };

  const createCourse = async (course) => {
    const newCourse = await model.create(course);
    return newCourse;
  };

  const deleteCourse = async (courseId) => {
    return await model.deleteOne({ _id: courseId });
  };

  const updateCourse = async (courseId, course) => {
    return await model.updateOne({ _id: courseId }, { $set: course });
  };

  return {
    findAllCourses,
    findCourseById,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
