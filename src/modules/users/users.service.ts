import { findAllUsers, findUserById } from "../../db/queries/users.queries.js";
import { AppError } from "../../lib/errors.js";

export async function getUsers() {
  return findAllUsers();
}

export async function getUsersById(id: string) {
  const user = await findUserById(id);

  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", `No user found with id ${id}`);
  }

  return user;
}

