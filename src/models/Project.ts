import { Schema, model, Document } from "mongoose";

interface IProject extends Document {
  title: string;
  description: string;
  clientId: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[]; // Reference to ProjectTag model
}

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "ProjectTag" }], // Reference to ProjectTag model
});

const Project = model<IProject>("Project", projectSchema);
export default Project;
