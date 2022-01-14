import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import ipLogger from "./ipLookup";
import { ACCESS_LOGGER_STREAM } from "./logger";

import hbs from "hbs";
hbs.registerPartials(path.join(__dirname, "views/partials"));

const PORT = process.env.PORT || 80;

const app = express();
app.use(helmet());
app.use(morgan("combined", { stream: ACCESS_LOGGER_STREAM }));
app.set("view engine", "hbs");
app.use(ipLogger);

app.get("/whatsmyip", (req, res) => {
  const ip = req.get("X-Real-IP");
  res.send({ ip, forwardedFor: req.ips });
});

app.get("/whoami", (req: any, res) => {
  res.render("whoami", req.agent);
});

app.get("/", (_, res) => {
  res.render("index");
});

app.listen(PORT);
