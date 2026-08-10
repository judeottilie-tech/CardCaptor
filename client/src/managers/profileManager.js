import { API_BASE } from "./apiConfig";

const _apiUrl = `${API_BASE}/profile`;

export const getProfile = (userName, signal) => {
  return fetch(`${_apiUrl}/${userName}`, { credentials: "include", signal }).then((res) => {
    if (!res.ok) return null;
    return res.json();
  });
};
