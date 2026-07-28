const _apiUrl = "/api/pet";

export const getPet = (signal) => {
  return fetch(_apiUrl, { credentials: "same-origin", signal }).then((res) => res.json());
};

export const feedPet = () => {
  return fetch(`${_apiUrl}/feed`, {
    method: "POST",
    credentials: "same-origin",
  }).then((res) => res.json());
};
