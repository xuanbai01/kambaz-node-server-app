// Kambaz/Modules/dao.js
import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";

export default function ModulesDao(db) {
  // Get all modules for a given course
  async function findModulesForCourse(courseId) {
    const course = await model.findById(courseId);
    if (!course) {
      return [];
    }
    return course.modules;
  }

  // Create a new module for a course
  async function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4() };
    await model.updateOne(
      { _id: courseId },
      { $push: { modules: newModule } }
    );
    return newModule;
  }

  // Delete a module from a course
  async function deleteModule(courseId, moduleId) {
    const status = await model.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } }
    );
    return status;
  }

  // Update a module inside a course
  async function updateModule(courseId, moduleId, moduleUpdates) {
    const course = await model.findById(courseId);
    if (!course) {
      throw new Error(`Course ${courseId} not found`);
    }
    const module = course.modules.id(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }

    Object.assign(module, moduleUpdates);
    await course.save();
    return module;
  }

  return {
    findModulesForCourse,
    createModule,
    updateModule,
    deleteModule,
  };
}
