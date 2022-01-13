import { Request, Response } from "express";
import * as api from "./api";
import parseUserAgent from "./userAgent";
import { IP_LOGGER } from "../logger";
import LRU from "lru-cache";

const cache = new LRU();

function getUserID(req: Request): string {
  // @ts-ignore
  const id = req.get("X-Real-IP") +"::"+ req.get("User-Agent");
  return id;
}

interface Agent {
  browser?: string;
  ip: string;
  hostname: string;
  os?: string;
}

async function addIp(id: string, req: Request): Promise<void> {
  const agent = req.get("user-agent") || "";
  const parsedUserAgent = parseUserAgent(agent);

  const ip = req.get("X-Real-IP") || "";
  const lookup = await api.ipLookup(ip);
  const entry: Agent = {
    browser: parsedUserAgent.browser.name,
    ip,
    hostname: req.hostname,
    os: parsedUserAgent.os.name,
    ...lookup,
  };
  IP_LOGGER.log({ level: "info", message: "IP address logged", meta: entry });

  cache.set(id, entry);
}

/** Looks up IPs and adds them to requests */
export default async function ipLogger(
  req: Request,
  _: Response,
  next: () => void
): Promise<void> {
  const id = getUserID(req);
  if (!cache.get(id)) {
    await addIp(id, req);
  }
  // @ts-ignore
  req.agent = cache.get(id);

  next();
}
