import { configDotenv } from "dotenv";
import { NextFunction, Request, Response } from "express";
configDotenv();

import express from "express";
import cors from "cors";
import router from "./routes/index";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} - ${req.path}`);
    next();
})

app.use(cors());
app.use(express.json());
app.use(router);

export default app;