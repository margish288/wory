import { Schema, model, Document } from "mongoose";

interface IProjectTag extends Document {
  name: string;
}

const projectTagSchema = new Schema<IProjectTag>({
  name: { type: String, required: true, unique: true },
});

const ProjectTag = model<IProjectTag>("ProjectTag", projectTagSchema);
export default ProjectTag;
