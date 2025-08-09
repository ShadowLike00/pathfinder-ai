import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({ label: String, url: String }, { _id: false });
const StepSchema = new mongoose.Schema(
  { title: String, why: String, topics: [String], resources: [ResourceSchema], project: String },
  { _id: false }
);

const RoadmapSchema = new mongoose.Schema(
  { goal: { type: String, required: true }, steps: [StepSchema] },
  { timestamps: true }
);

export const Roadmap = mongoose.models.Roadmap || mongoose.model("Roadmap", RoadmapSchema);
