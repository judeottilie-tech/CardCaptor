import { API_BASE } from "./apiConfig";

const _apiUrl = `${API_BASE}/pet`;

export const getPet = (signal) => {
  return fetch(_apiUrl, { credentials: "include", signal }).then((res) => res.json());
};

export const feedPet = () => {
  return fetch(`${_apiUrl}/feed`, {
    method: "POST",
    credentials: "include",
  }).then((res) => res.json());
};
