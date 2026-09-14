import type { Request, Response, NextFunction } from "express";
import { getUsers, getUsersById } from "./users.service.js";

export async function getUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getUsers();

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
