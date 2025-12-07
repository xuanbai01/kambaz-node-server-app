// Kambaz/Quizzes/attemptModel.js
import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    // quiz itself is a Mongo ObjectId in your quizzes collection
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    // your course ids are strings like "CS4550" or "5610"
    course: {
      type: String,
      ref: "Course",
      required: true,
    },

    // your user ids are strings like "567"
    student: {
      type: String,
      ref: "User",
      required: true,
    },

    attemptNumber: { type: Number, required: true }, // 1, 2, 3...
    score: { type: Number, required: true },
    possibleScore: { type: Number, required: true },

    answers: [
      {
        questionIndex: Number,
        value: mongoose.Schema.Types.Mixed, // index for MC/TF, string for FIB
        isCorrect: Boolean,
      },
    ],

    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "quiz_attempts" }
);

const quizAttemptModel = mongoose.model("QuizAttempt", quizAttemptSchema);
export default quizAttemptModel;
