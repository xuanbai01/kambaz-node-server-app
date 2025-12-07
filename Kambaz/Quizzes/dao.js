// Quizzes/dao.js
import quizModel from "./model.js";
import quizAttemptModel from "./attemptModel.js";

// ===== QUIZZES DAO =====

export const findQuizzesForCourse = (courseId) =>
  quizModel.find({ course: courseId });

export const findQuizById = (quizId) => quizModel.findById(quizId);

export const createQuizForCourse = (courseId, quiz = {}) => {
  const base = {
    course: courseId,
    title: "New Quiz",
    description: "",
    points: 0,
    published: false,
    questions: [],
  };
  return quizModel.create({ ...base, ...quiz });
};

export const updateQuiz = (quizId, quiz) =>
  quizModel.updateOne({ _id: quizId }, { $set: quiz });

export const deleteQuiz = (quizId) => quizModel.deleteOne({ _id: quizId });

// ===== ATTEMPTS DAO =====

export const createAttempt = (attempt) => quizAttemptModel.create(attempt);

export const findAttemptsForQuizAndStudent = (quizId, studentId) =>
  quizAttemptModel
    .find({ quiz: quizId, student: studentId })
    .sort({ attemptNumber: 1, submittedAt: 1 });

export const findLastAttemptForQuizAndStudent = (quizId, studentId) =>
  quizAttemptModel
    .findOne({ quiz: quizId, student: studentId })
    .sort({ attemptNumber: -1, submittedAt: -1 });

export const deleteAttemptsForQuiz = (quizId) =>
  quizAttemptModel.deleteMany({ quiz: quizId });
