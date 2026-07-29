import { API_BASE } from "./apiConfig";

const _apiUrl = `${API_BASE}/card`;

export const getCards = (params, signal) => {
  const query = new URLSearchParams(params).toString();
  return fetch(`${_apiUrl}?${query}`, {
    credentials: "include",
    signal,
  }).then((res) => res.json());
};
