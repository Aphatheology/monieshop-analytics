import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyticsRoute from './routes/analytics.route';

dotenv.config();
const app = express();

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", analyticsRoute);
app.get("/", (req, res) => {
  res.send({ message: "Welcome to my Monieshop Analytics" });
});

app.use("*", (req, res) => {
  res.status(404).send({ message: "Route Not found" });
});

export default app;
