import express from "express";
import helmet from "helmet";
import morgan, { FormatFn } from "morgan";
import path from "path";

import ipLogger from "./ipLookup";
import { ACCESS_LOGGER_STREAM } from "./logger";

import hbs from "hbs";
hbs.registerPartials(path.join(__dirname, "views/partials"));

const PORT = process.env.PORT || 80;

const MorganJSONFormat: FormatFn = (tokens, req, res) =>
  JSON.stringify({
    status: tokens.status(req, res),
    method: tokens.method(req, res),
    "Remote-user": tokens["remote-user"](req, res),
    "Remote-address": tokens["remote-addr"](req, res),
    URL: tokens.url(req, res),
    HTTPversion: "HTTP/" + tokens["http-version"](req, res),
    "Response-time": tokens["response-time"](req, res, "digits"),
    date: tokens.date(req, res, "web"),
    Referrer: tokens.referrer(req, res),
    "User-agent": tokens["user-agent"](req, res),
  });

const app = express();
app.use(helmet());
app.use(morgan(MorganJSONFormat, { stream: ACCESS_LOGGER_STREAM }));
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
