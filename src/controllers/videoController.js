import Video from "../models/Video";

export const home = async (req, res) => {
  // todo: 최신순(오름차순, 내림차순), 조회순, 좋아요 순
  let videos = await Video.find({}).sort({ date: "desc" });

  const { search } = req.query;
  if (search) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(search, "i"), // search가 포함된 제목, 대소문자 구분 안함
      },
    }).sort({ date: "desc" });
  }
  return res.render("home", { pageTitle: "Home", videos, search });
};

export const getUploadVideo = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUploadVideo = async (req, res) => {
  // todo: user의 업로드한 비디오로 이동하기
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      // todo: 해시태그를 +버튼을 누르고 각각 추가하기
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const watchVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch-video", { pageTitle: video.title, video });
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit-video", { pageTitle: `Edit ${video.title}`, video });
};

export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
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
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};
