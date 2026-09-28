import { request } from "./client";

export const authApi = {
  register(credentials, options = {}) {
    return request("/auth/register", {
      method: "POST",
      body: credentials,
      signal: options.signal,
    });
  },

  login(credentials, options = {}) {
    return request("/auth/login", {
      method: "POST",
      body: credentials,
      signal: options.signal,
    });
  },

  me(token, options = {}) {
    return request("/auth/me", {
      token,
      signal: options.signal,
    });
  },

  deleteProfile(token, options = {}) {
    return request("/auth/profile", {
      method: "DELETE",
      token,
      signal: options.signal,
    });
  },
};