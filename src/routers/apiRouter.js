import express from "express";
import {
  createComment,
  deleteComment,
  registerView,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/video/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/video/:id([0-9a-f]{24})/comment", createComment);
apiRouter.post("/video/:id([0-9a-f]{24})/delete-comment", deleteComment);

export default apiRouter;
