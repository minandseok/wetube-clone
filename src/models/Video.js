import mongoose from "mongoose";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 60,
    minLength: 1,
  },
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, maxLength: 200 },
  date: { type: Date, required: true, default: Date.now, get: formatDate },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, required: true, default: 0 },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
});

// todo: 해시태그 양쪽 띄어쓰기 없애기
videoSchema.static("formatHashtags", (hashtags) => {
  return hashtags
    .split(",")
    .map((hashtag) => (hashtag.startsWith("#") ? hashtag : `#${hashtag}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
