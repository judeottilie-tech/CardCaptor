import { describe, it, expect, vi, beforeEach } from "vitest";
import { attachCard, removeCard } from "./binderPageCardSlotManager";

describe("binderPageCardSlotManager", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });

  it("attachCard PUTs cardId in the body to the slot's card sub-route", async () => {
    await attachCard(12, 34);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/binderpagecardslot/12/card",
      expect.objectContaining({ method: "PUT" }),
    );
    const [, options] = global.fetch.mock.calls[0];
    expect(JSON.parse(options.body)).toEqual({ cardId: 34 });
  });

  it("removeCard DELETEs the slot's card sub-route", async () => {
    await removeCard(12);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/binderpagecardslot/12/card",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
