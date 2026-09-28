import { request } from "./client";

export const tasksApi = {
  getAll(token, options = {}) {
    return request("/tasks", {
      token,
      signal: options.signal,
    });
  },

  getById(token, taskId, options = {}) {
    return request(`/tasks/${taskId}`, {
      token,
      signal: options.signal,
    });
  },

  create(token, task, options = {}) {
    return request("/tasks", {
      method: "POST",
      token,
      body: task,
      signal: options.signal,
    });
  },

  update(token, taskId, changes, options = {}) {
    return request(`/tasks/${taskId}`, {
      method: "PATCH",
      token,
      body: changes,
      signal: options.signal,
    });
  },

  remove(token, taskId, options = {}) {
    return request(`/tasks/${taskId}`, {
      method: "DELETE",
      token,
      signal: options.signal,
    });
  },
};