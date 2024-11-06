import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import session from "express-session";
import { localsMiddleware } from "./middlewares";

const logger = morgan("dev");

const app = express();

app.set("view engine", "pug");
app.set("views", `${process.cwd()}/src/views`);
app.set("x-powered-by", false);
app.use(express.urlencoded({ extended: true }));

// session middleware
app.use(
  session({
    secret: "hello",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(localsMiddleware);
app.use(logger);
app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

export default app;
