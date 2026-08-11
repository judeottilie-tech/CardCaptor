import { API_BASE } from "./apiConfig";

const _apiUrl = `${API_BASE}/sideboard`;

export const getSideboard = (binderPageId) => {
  return fetch(`${_apiUrl}?binderPageId=${binderPageId}`, { credentials: "include" }).then((res) =>
    res.json(),
  );
};

export const addToSideboard = (cardId, binderPageId) => {
  return fetch(_apiUrl, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardId, binderPageId }),
  }).then((res) => res.json());
};

export const removeFromSideboard = (id) => {
  return fetch(`${_apiUrl}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};
