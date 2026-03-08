// src/api.ts
// These functions connect your React frontend to the Express backend.
// They are already wired up and working — you can focus on the UI and server logic.
// TODO: If you add new endpoints to the server, add matching functions here.

import type { Task, NewTask, UpdateTask } from "./types";

type GetTasksFilters = {
  completed?: boolean;
  priority?: "low" | "medium" | "high";
};

const BASE_URL = "http://localhost:3001/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${message}`);
  }
  return res.json() as Promise<T>;
}

export const getTasks = async (filters?: GetTasksFilters): Promise<Task[]> => {
  const params = new URLSearchParams();

  if (filters?.completed !== undefined) {
    params.set("completed", String(filters.completed));
  }

  if (filters?.priority) {
    params.set("priority", filters.priority);
  }

  const queryString = params.toString();

  const url = queryString
    ? `${BASE_URL}/tasks?${queryString}`
    : `${BASE_URL}/tasks`;

  const res = await fetch(url);
  return handleResponse<Task[]>(res);
};

export const createTask = async (task: NewTask): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return handleResponse<Task>(res);
};

export const updateTask = async (
  id: string,
  updates: UpdateTask,
): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return handleResponse<Task>(res);
};

export const deleteTask = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const message = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${message}`);
  }
};
