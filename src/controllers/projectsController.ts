import {Request, Response} from 'express';
import pool from '../db';

interface ProjectBody {
  name: string
  description?: string  // o "?" significa que é opcional
}

export const getProjects = async (req: Request, res: Response) => {
    const userId = req.userId;

    const projectsResult = await pool.query(
        'SELECT id, name, description FROM projects WHERE owner_id = $1',
        [userId]
    );

    if(projectsResult.rows.length === 0) {
        return res.status(404).json({ error: 'Projects not found' });
    }

    return res.json({ projects: projectsResult.rows});
}

export const createProject = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { name, description } = req.body;

    const newProjectResult = await pool.query(
        'INSERT INTO projects (owner_id, name, description) VALUES ($1, $2, $3) RETURNING id, name, description',
        [userId, name, description]
    );

    return res.status(201).json({ project: newProjectResult.rows[0] });
}

export const getProjectById = async (req: Request, res: Response) => {
    const userId = req.userId;
    const projectId = req.params.id;

    const projectResult = await pool.query(
        'SELECT id, name, description FROM projects WHERE id = $1 AND owner_id = $2',
        [projectId, userId]
    );

    if(projectResult.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
    }

    return res.json({ project: projectResult.rows[0] });
}

export const updateProject = async (req: Request, res: Response) => {
    const userId = req.userId;
    const projectId = req.params.id;
    const { name, description } = req.body;

    const updatedProjectResult = await pool.query(
        'UPDATE projects SET name = $1, description = $2 WHERE id = $3 AND owner_id = $4 RETURNING id, name, description',
        [name, description, projectId, userId]
    );

    if(updatedProjectResult.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found or not owned by user' });
    }

    return res.json({ project: updatedProjectResult.rows[0] });
}

export const deleteProject = async (req: Request, res: Response) => {
    const userId = req.userId;
    const projectId = req.params.id;

    const deleteResult = await pool.query(
        'DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING id',
        [projectId, userId]
    );

    if(deleteResult.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found or not owned by user' });
    }

    return res.json({ message: 'Project deleted successfully' });
}