import { Schema, model, Document } from "mongoose";

interface IProject extends Document {
  title: string;
  description: string;
  clientId: Schema.Types.ObjectId;
  tag: Schema.Types.ObjectId;
}

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tag: { type: Schema.Types.ObjectId, ref: "ProjectTag", required: true },
});

const Project = model<IProject>("Project", projectSchema);
export default Project;
