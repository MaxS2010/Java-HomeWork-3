import express from "express";
import { createTaskRepository } from "./repositories/task.js";
import { createUserRepository } from "./repositories/user.js";
import { createTaskService } from "./services/task/task.js";
import { createUserService } from "./services/user/user.js";
import { db } from "./prisma/db.js";
import { createAuthRouter } from "./transport/routers/auth.js";
import { createTaskRouter } from "./transport/routers/task.js";
import { createUserRouter } from "./transport/routers/user.js";

const HOST: string = 'localhost';
const PORT: number = 8000;

const app = express();
const userRepository = createUserRepository();
const taskRepository = createTaskRepository(db);
const userService = createUserService(userRepository);
const taskService = createTaskService(taskRepository, userRepository);

app.use(express.json());
app.use("/auth", createAuthRouter(userService));
app.use("/users", createUserRouter(userService));
app.use("/tasks", createTaskRouter(taskService));

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
}); 