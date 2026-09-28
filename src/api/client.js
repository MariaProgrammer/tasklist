const rawApiBase =
  import.meta.env.VITE_API_BASE_URL || "/api";

const API_BASE = rawApiBase.replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function isUnauthorizedError(error) {
  return error instanceof ApiError && error.status === 401;
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text,
    };
  }
}

export async function request(
  path,
  {
    method = "GET",
    body,
    token,
    signal,
  } = {}
) {
  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new ApiError(
      "Не удалось подключиться к серверу",
      0
    );
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      data.message || `Ошибка HTTP ${response.status}`,
      response.status,
      data
    );
  }

  return data;
}