import { API_BASE } from "./apiConfig";

const _apiUrl = `${API_BASE}/sideboard`;

export const getSideboard = () => {
  return fetch(_apiUrl, { credentials: "include" }).then((res) => res.json());
};

export const addToSideboard = (cardId) => {
  return fetch(_apiUrl, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardId }),
  }).then((res) => res.json());
};

export const removeFromSideboard = (id) => {
  return fetch(`${_apiUrl}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};
