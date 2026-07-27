const _apiUrl = "/api/card";

export const getCards = (params, signal) => {
  const query = new URLSearchParams(params).toString();
  return fetch(`${_apiUrl}?${query}`, {
    credentials: "same-origin",
    signal,
  }).then((res) => res.json());
};
