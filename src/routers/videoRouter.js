import express from "express";
import {
  deleteVideo,
  editVideo,
  uploadVideo,
  watchVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", uploadVideo);
videoRouter.get("/:id(\\d+)", watchVideo);
videoRouter.get("/:id(\\d+)/edit", editVideo);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
