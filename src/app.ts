import usersRouter from "./modules/users/users.routes.js";
import express, { type Express } from "express";

const app: Express = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running 🚀",
  });
});

app.use("/api/users", usersRouter);

export default app;
