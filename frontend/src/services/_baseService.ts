import { config } from "@/config";

type Options = {
  method?: "POST" | "GET" | "PUT" | "DELETE";
  token?: string;
  data?: unknown;
};

export const baseService = async (url: string, options: Options = {}) => {
  const { BASE_API_URL } = config;

  try {
    const { method = "GET", token, data } = options;

    const reqOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      reqOptions.body = JSON.stringify(data);
    }

    if (token) {
      reqOptions.headers = {
        ...reqOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(`${BASE_API_URL + url}`, reqOptions);

    // Manejo de respuestas que no son JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Not a JSON response");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Internal server error");
    }
  }
};
