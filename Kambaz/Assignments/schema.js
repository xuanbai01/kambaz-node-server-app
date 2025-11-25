import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const assignmentSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },  
    course: String,

    title: { type: String, default: "New Assignment" },
    description: { type: String, default: "" },
    points: { type: Number, default: 100 },

    due: { type: String, default: null },
    availableFrom: { type: String, default: null },
    availableUntil: { type: String, default: null },
  },
  { collection: "assignments" }
);

export default assignmentSchema;