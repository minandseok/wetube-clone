import Video from "../models/Video";
import Comment from "../models/Comment";
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
      fileUrl: video[0].location,
      thumbUrl: thumb[0].location.replace(/[\\]/g, "/"),
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
  const video = await Video.findById(id).populate("owner").populate("comments");

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
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res
    .status(400)
    .render("videos/edit-video", { pageTitle: `Edit ${video.title}`, video });
};

export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.findOne({ _id: id });

  if (!video || video === null) {
    return res.status(400).render("404", { pageTitle: "Video not found." });
  }

  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
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

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id: commentId },
    session: { user },
  } = req;

  try {
    // 댓글 찾기
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // 댓글 작성자 확인
    if (String(comment.owner) !== String(user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 댓글 삭제
    await Comment.findByIdAndDelete(commentId);

    // 비디오에서 댓글 참조 제거
    await Video.findByIdAndUpdate(comment.video, {
      $pull: { comments: commentId },
    });

    // 유저에서 댓글 참조 제거
    await User.findByIdAndUpdate(comment.owner, {
      $pull: { comments: commentId },
    });

    return res.status(200).json({ message: "Comment deleted." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
