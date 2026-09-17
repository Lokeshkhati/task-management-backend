import type { Request, Response, NextFunction } from "express";
import {  getUsersById, getUsersService } from "./users.service.js";

export async function getUsersController(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getUsersService();

    res.json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsersByIdController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await getUsersById(req.params.id);

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
