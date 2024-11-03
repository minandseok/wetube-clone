import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const logger = morgan("dev");

const app = express();

app.set("view engine", "pug");
app.set("views", `${process.cwd()}/src/views`);
app.set("x-powered-by", false);
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

export default app;
