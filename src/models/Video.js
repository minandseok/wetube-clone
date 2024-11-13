import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 60,
    minLength: 1,
  },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, maxLength: 200 },
  date: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, required: true, default: 0 },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

// todo: 해시태그 양쪽 띄어쓰기 없애기
videoSchema.static("formatHashtags", (hashtags) => {
  return hashtags
    .split(",")
    .map((hashtag) => (hashtag.startsWith("#") ? hashtag : `#${hashtag}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
