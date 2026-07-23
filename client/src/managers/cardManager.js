import { API_BASE } from "./apiConfig";

const _apiUrl = `${API_BASE}/card`;

export const getCards = (signal) => {
  return fetch(_apiUrl, { credentials: "include", signal })
  .then((res) =>
    res.json(),
  );
};
