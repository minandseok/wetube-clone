import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;
const logger = morgan("dev");

const app = express();

app.set("view engine", "pug");
app.set("views", `${process.cwd()}/src/views`);
app.set("x-powered-by", false);

app.use(logger);
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

const handleListening = () =>
  console.log(`Server is Listening! => http://localhost:${PORT}/`);

app.listen(PORT, handleListening);
