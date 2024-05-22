import axios, { AxiosRequestConfig } from "axios";
import { config } from "@/config";

type Options = {
  method?: "POST" | "GET" | "PUT" | "DELETE";
  token?: string;
  data?: unknown;
};

export const apiService = async (url: string, options: Options = {}) => {
  const BASE_API_URL = config.URLS.BASE_API_URL;

  const { method = "GET", token, data } = options;

  const reqOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method,
    url: `${BASE_API_URL + url}`,
    data,
  };

  if (token) {
    reqOptions.headers = {
      ...reqOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const { data: response } = await axios(reqOptions);

  return response.data;
};
