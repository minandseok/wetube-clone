export const home = (rea, res) => {
  return res.render("home", { pageTitle: "Home" });
};

export const searchVideo = (rea, res) => {
  return res.send("Search Video");
};

export const uploadVideo = (rea, res) => {
  return res.send("Upload Video");
};

export const watchVideo = (rea, res) => {
  return res.render("watch-video", { pageTitle: "Video" });
};

export const editVideo = (rea, res) => {
  return res.send("Edit Video");
};

export const deleteVideo = (rea, res) => {
  return res.send("Delete Video");
};
