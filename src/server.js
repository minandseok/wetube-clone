import express from "express";
import morgan from "morgan";

const PORT = 4000;
const logger = morgan("dev");

const app = express();

const handleHome = (req, res) => {
  return res.end();
};

app.use(logger);
app.get("/", handleHome);

const handleListening = () =>
  console.log(`Server is Listening! => http://localhost:${PORT}/`);

app.listen(PORT, handleListening);
