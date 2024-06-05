import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  role: "Client" | "Freelancer";
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Client", "Freelancer"], required: true },
});

const User = model<IUser>("User", userSchema);
export default User;
