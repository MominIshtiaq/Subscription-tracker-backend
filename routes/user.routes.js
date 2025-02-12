import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import {
  getUser,
  getUsers,
  setUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.use(authorize);

userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);
userRouter.post("/", setUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
