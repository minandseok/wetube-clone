import session from "express-session";
import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
  // todo: 최신순(오름차순, 내림차순), 조회순, 좋아요 순
  let videos = await Video.find({}).sort({ date: "desc" }).populate("owner");

  // Search Video
  const { search } = req.query;
  if (search) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(search, "i"), // search가 포함된 제목, 대소문자 구분 안함
      },
    })
      .sort({ date: "desc" })
      .populate("owner");
  }

  return res
    .status(400)
    .render("videos/home", { pageTitle: "Home", videos, search });
};

export const getUploadVideo = (req, res) => {
  return res.status(400).render("videos/upload", { pageTitle: "Upload" });
};

export const postUploadVideo = async (req, res) => {
  // todo: user의 업로드한 비디오로 이동하기
  const { user: _id } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      // todo: 해시태그를 +버튼을 누르고 각각 추가하기
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path.replace(/[\\]/g, "/"),
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload",
      errorMessage: error._message,
    });
  }
};

export const watchVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");

  if (!video) {
    return res.status(400).render("404", { pageTitle: "Video not found." });
  }

  return res
    .status(400)
    .render("videos/watch-video", { pageTitle: video.title, video });
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(400).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res
    .status(400)
    .render("videos/edit-video", { pageTitle: `Edit ${video.title}`, video });
};

export const postEditVideo = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(400).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/video/${id}`);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};
