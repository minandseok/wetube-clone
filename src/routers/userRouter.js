import express from "express";
import {
  deleteUser,
  finishGitHubLogin,
  getChangePassword,
  getCreatePassword,
  getEditProfile,
  logout,
  postChangePassword,
  postCreatePassword,
  postEditProfile,
  profile,
  startGitHubLogin,
} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

// /:id(\\d+)
userRouter.route("/logout").all(protectorMiddleware).get(logout);
userRouter.route("/profile").all(protectorMiddleware).get(profile);
userRouter
  .route("/create-password")
  .all(protectorMiddleware)
  .get(getCreatePassword)
  .post(postCreatePassword);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEditProfile)
  .post(postEditProfile);
userRouter.route("/delete").all(protectorMiddleware).get(deleteUser);
userRouter
  .route("/github/start")
  .all(publicOnlyMiddleware)
  .get(startGitHubLogin);
userRouter
  .route("/github/finish")
  .all(publicOnlyMiddleware)
  .get(finishGitHubLogin);

export default userRouter;
