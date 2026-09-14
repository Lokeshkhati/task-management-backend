import express from "express";
import {
  getUsersController,
  getUsersByIdController,
} from "./users.controller.js";

const userRouter: express.Router = express.Router();

userRouter.get("/", getUsersController);
userRouter.get("/:id", getUsersByIdController);

export default userRouter;
