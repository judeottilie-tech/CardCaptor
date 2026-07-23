import { API_BASE } from "./apiConfig";

const _apiUrl = `${API_BASE}/binderpagecardslot`;

export const attachCard = (slotId, cardId) => {
  return fetch(`${_apiUrl}/${slotId}/card`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardId }),
  });
};

export const removeCard = (slotId) => {
  return fetch(`${_apiUrl}/${slotId}/card`, {
    method: "DELETE",
    credentials: "include",
  });
};
