const _apiUrl = "/api/card";

export const getCards = () => {
  return fetch(_apiUrl, { credentials: "same-origin" })
  .then((res) =>
    res.json(),
  );
};
