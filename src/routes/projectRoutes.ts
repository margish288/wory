import { Router } from "express";
import {
  addProject,
  updateProject,
  listProjects,
  removeProject,
  getProjectsByTag,
} from "../controllers/projectController";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.post("/add", isAuthenticated("Client"), addProject);
router.put("/update/:id", isAuthenticated("Client"), updateProject);
router.get("/list", isAuthenticated("Client"), listProjects);
router.delete("/remove/:id", isAuthenticated("Client"), removeProject);
router.get(
  "/tags/:tag",
  isAuthenticated("Client", "Freelancer"),
  getProjectsByTag
);

export default router;
