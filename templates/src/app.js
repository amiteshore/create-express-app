import express from "express";
import morgan from "morgan";

import { notFound, genericErrorHandler } from "./middlewares/errorHandler.js";
import indexRoute from "./routes/index.js";

const app = express();

app.set("json spaces", 2);

app.use(express.json());
app.use(morgan("dev"));

app.use("/", indexRoute);

app.use(notFound);
app.use(genericErrorHandler);

export default app;
