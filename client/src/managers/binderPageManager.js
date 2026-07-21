const _apiUrl = "/api/binderpage";

export const getBinderPages = (signal) => {
  return fetch(_apiUrl, { credentials: "same-origin", signal }).then((res) =>
    res.json(),
  );
};

export const getBinderPageById = (id, signal) => {
  return fetch(`${_apiUrl}/${id}`, { credentials: "same-origin", signal }).then((res) => {
    if (!res.ok) return null;
    return res.json();
  });
};

export const createBinderPage = (binderPage) => {
  return fetch(_apiUrl, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(binderPage),
  }).then((res) => {
    if (res.ok) return res.json();
    return res.json();
  });
};

export const updateBinderPage = (id, binderPage) => {
  return fetch(`${_apiUrl}/${id}`, {
    method: "PUT",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(binderPage),
  });
};

export const deleteBinderPage = (id) => {
  return fetch(`${_apiUrl}/${id}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
};
