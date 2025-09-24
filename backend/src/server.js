import express from "express";
import cors from "cors";
import morgan from "morgan";
import {
  newsItems,
  actors,
  resources,
  trainings,
  services,
  kpi,
  adminMetrics,
  adminMessages,
  adminUsers
} from "./data.js";

const app = express();
const PORT = process.env.PORT || 4000;
const API_PREFIX = process.env.API_PREFIX || "/api";

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get(`${API_PREFIX}/health`, (_, res) => {
  res.json({ status: "ok" });
});

app.get(`${API_PREFIX}/news`, (_, res) => {
  res.json(newsItems);
});

app.get(`${API_PREFIX}/actors`, (_, res) => {
  res.json(actors);
});

app.get(`${API_PREFIX}/resources`, (_, res) => {
  res.json(resources);
});

app.get(`${API_PREFIX}/trainings`, (_, res) => {
  res.json(trainings);
});

app.get(`${API_PREFIX}/services`, (_, res) => {
  res.json(services);
});

app.get(`${API_PREFIX}/kpi`, (_, res) => {
  res.json(kpi);
});

app.get(`${API_PREFIX}/dashboard/metrics`, (_, res) => {
  res.json(adminMetrics);
});

app.get(`${API_PREFIX}/dashboard/messages`, (_, res) => {
  res.json(adminMessages);
});

app.get(`${API_PREFIX}/dashboard/users`, (_, res) => {
  res.json(adminUsers);
});

app.use((_, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Bamatech API running on port ${PORT}`);
});
