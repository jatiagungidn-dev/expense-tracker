import express, { Express, type Request, type Response } from "express";
import cors from "cors";

const app: Express = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Expense Tracker is running",
    timestamp: new Date().toISOString(),
  });
});

export default app;
