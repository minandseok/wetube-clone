import express from "express";
import {
  deleteUser,
  editUser,
  finishGitHubLogin,
  logout,
  profile,
  startGitHubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/:id(\\d+)", profile);
userRouter.get("/:id(\\d+)/edit", editUser);
userRouter.get("/:id(\\d+)/delete", deleteUser);
userRouter.get("/github/start", startGitHubLogin);
userRouter.get("/github/finish", finishGitHubLogin);

export default userRouter;
