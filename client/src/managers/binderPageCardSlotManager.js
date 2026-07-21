const _apiUrl = "/api/binderpagecardslot";

export const attachCard = (slotId, cardId) => {
  return fetch(`${_apiUrl}/${slotId}/card`, {
    method: "PUT",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardId }),
  });
};

export const removeCard = (slotId) => {
  return fetch(`${_apiUrl}/${slotId}/card`, {
    method: "DELETE",
    credentials: "same-origin",
  });
};
