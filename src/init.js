import "./db.js";
import "./models/Video.js";
import "./models/User";
import app from "./server.js";

const PORT = 4000;

const handleListening = () =>
  console.log(`Server is Listening! => http://localhost:${PORT}/`);

app.listen(PORT, handleListening);
