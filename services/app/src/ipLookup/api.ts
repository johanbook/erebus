import fetch from "node-fetch";

const API_URL = "http://ip-api.com/json/";

interface BaseResponse {
  query: string;
}

interface FailedResponse extends BaseResponse {
  message: string;
  status: "fail";
}

interface SuccessfulResponse extends BaseResponse {
  country: string;
  city: string;
  isp: string;
  status: "success";
  zip: string;
}

export type ApiResponse = SuccessfulResponse | FailedResponse;

/** Looks up IP using external API */
export async function ipLookup(ip: string): Promise<ApiResponse> {
  const response = await fetch(`${API_URL}${ip}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const json: ApiResponse = await response.json();
  return json;
}
