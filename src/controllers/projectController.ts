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
  const { title, description, tag } = request.body;
  const clientId = request.user?.id;

  try {
    let projectTag = await ProjectTag.findOne({ name: tag });

    if (!projectTag) {
      projectTag = new ProjectTag({ name: tag });
      await projectTag.save();
    }

    const newProject = new Project({
      title,
      description,
      tag: projectTag._id,
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
  const { title, description, tag } = req.body;

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updateObject = {
      title: title || project.title,
      description: description || project.description,
      tag: tag || project.tag,
    };

    const updatedProject = await Project.findByIdAndUpdate(id, updateObject, {
      new: true,
    });

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
    const projects = await Project.find().populate("tag");

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

    const projects = await Project.find({ tag: projectTag._id }).populate(
      "tag"
    );

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: "Error fetching projects by tag" });
  }
};
