import usersRouter from "./modules/users/users.routes.js";
import express, { type Express } from "express";
import { indexRouter } from "./routes/index.js";
import { corsMiddleware } from "./middleware/cors.middleware.js";

const app: Express = express();

app.use(express.json());
app.use(corsMiddleware)

app.use('/', indexRouter);
app.use("/api/v1/users", usersRouter);

export default app;
