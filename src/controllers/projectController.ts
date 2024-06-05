import { Request, Response } from "express";
import Project from "../models/Project";
import ProjectTag from "../models/ProjectTag";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
    };
  }
}

export const addProject = async (request: Request, res: Response) => {
  const { title, description, tags } = request.body;
  const clientId = request.user?.id;

  try {
    const tagIds = await Promise.all(
      tags.map(async (tag: string) => {
        let projectTag = await ProjectTag.findOne({ name: tag });
        if (!projectTag) {
          projectTag = new ProjectTag({ name: tag });
          await projectTag.save();
        }
        return projectTag._id;
      })
    );

    const newProject = new Project({
      title,
      description,
      tags: tagIds,
      clientId,
    });

    await newProject.save();

    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: "Error adding project" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;

  try {
    const tagIds = await Promise.all(
      tags.map(async (tag: string) => {
        let projectTag = await ProjectTag.findOne({ name: tag });
        if (!projectTag) {
          projectTag = new ProjectTag({ name: tag });
          await projectTag.save();
        }
        return projectTag._id;
      })
    );

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, description, tags: tagIds },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: "Error updating project" });
  }
};

export const listProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().populate("tags");

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: "Error fetching projects" });
  }
};

export const removeProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const removedProject = await Project.findByIdAndDelete(id);

    if (!removedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project removed" });
  } catch (err) {
    res.status(500).json({ error: "Error removing project" });
  }
};

export const getProjectsByTag = async (req: Request, res: Response) => {
  const { tag } = req.params;

  try {
    const projectTag = await ProjectTag.findOne({ name: tag });

    if (!projectTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    const projects = await Project.find({ tags: projectTag._id }).populate(
      "tags"
    );

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: "Error fetching projects by tag" });
  }
};
