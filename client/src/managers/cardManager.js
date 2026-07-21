const _apiUrl = "/api/card";

export const getCards = (signal) => {
  return fetch(_apiUrl, { credentials: "same-origin", signal })
  .then((res) =>
    res.json(),
  );
};
