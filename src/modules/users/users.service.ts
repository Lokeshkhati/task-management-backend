import { AppError } from "../../lib/errors.js";
import { findAllUsers, findUserById } from "./users.repository.js";

export async function getUsersService() {
  return findAllUsers();
}

export async function getUsersById(id: string) {
  const user = await findUserById(id);

  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", `No user found with id ${id}`);
  }

  return user;
}

