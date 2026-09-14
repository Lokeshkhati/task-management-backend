import express from "express";
import {
  getUsersController,
  getUsersByIdController,
} from "./users.controller.js";

const router: express.Router = express.Router();

router.get("/", getUsersController);
router.get("/:id", getUsersByIdController);

export default router;
