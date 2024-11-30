import "dotenv/config";
import "./db.js";
import "./models/Video.js";
import "./models/User.js";
import "./models/Comment.js";
import app from "./server.js";

const PORT = 3000;

const handleListening = () =>
  console.log(`Server is Listening! => http://localhost:${PORT}/`);

app.listen(PORT, handleListening);
