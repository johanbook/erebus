import { Request, Response } from "express";
import * as api from "./api";
import parseUserAgent from "./userAgent";

interface Agent {
  browser?: string;
  ip: string;
  os?: string;
}

const IPS: Record<string, Agent> = {};

async function addIp(req: Request): Promise<void> {
  const agent = req.get("user-agent") || "";
  const parsedUserAgent = parseUserAgent(agent);

  const ip = req.get("X-Real-IP") || "";
  const lookup = await api.ipLookup(ip);
  const entry = {
    browser: parsedUserAgent.browser.name,
    ip,
    os: parsedUserAgent.os.name,
    ...lookup,
  };
  console.log(ip, { entry });

  IPS[ip] = entry;
}

/** Looks up IPs and adds them to requests */
export default async function ipLogger(
  req: Request,
  _: Response,
  next: () => void
): Promise<void> {
  const ip = req.get("X-Real-IP") || "";
  if (!(ip in IPS)) {
    await addIp(req);
  }
  // @ts-ignore
  req.agent = IPS[ip];

  next();
}
