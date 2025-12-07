import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
      default: "MULTIPLE_CHOICE",
    },
    points: { type: Number, default: 1 },

    choices: [{ type: String }],

    correctChoice: { type: Number, default: 0 },

    correctAnswers: [{ type: String }],

    explanation: String,
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    course: { type: String, required: true },

    title: { type: String, default: "New Quiz" },
    description: { type: String, default: "" },

    published: { type: Boolean, default: false },

    quizType: {
      type: String,
      enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
      default: "GRADED_QUIZ",
    },
    points: { type: Number, default: 0 },
    assignmentGroup: {
      type: String,
      enum: ["Quizzes", "Exams", "Assignments", "Project"],
      default: "Quizzes",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    maxAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "AFTER_DUE" },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },

    dueDate: Date,
    availableDate: Date,
    untilDate: Date,

    questions: [questionSchema],
  },
  { collection: "quizzes", timestamps: true }
);

export default quizSchema;
