import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import config from "./config";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";

const app = express();
app.use(express.json());

mongoose
  .connect(config.dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log("MongoDB connected...", config.dbUri))
  .catch((err) => console.error(err));

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

export default app;
