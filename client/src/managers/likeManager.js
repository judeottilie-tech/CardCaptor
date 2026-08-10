import { API_BASE } from "./apiConfig";

const _apiUrl = `${API_BASE}/binderpagelike`;

export const likeBinderPage = (binderPageId) => {
  return fetch(_apiUrl, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ binderPageId }),
  });
};

export const unlikeBinderPage = (binderPageId) => {
  return fetch(`${_apiUrl}/${binderPageId}`, {
    method: "DELETE",
    credentials: "include",
  });
};
