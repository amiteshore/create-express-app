import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { notFound, genericErrorHandler } from "./middlewares/errorHandler.js";
import indexRoute from "./routes/index.js";

const app = express();

app.set("json spaces", 2);

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/", indexRoute);

app.use(notFound);
app.use(genericErrorHandler);

export default app;
