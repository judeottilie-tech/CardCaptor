import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCards } from "./cardManager";

describe("cardManager", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ totalCount: 0, cards: [] }),
    });
  });

  it("serializes params into the query string", async () => {
    await getCards({ page: 2, pageSize: 12, search: "pikachu" });

    const [url] = global.fetch.mock.calls[0];
    expect(url).toBe("/api/card?page=2&pageSize=12&search=pikachu");
  });

  it("passes through empty-string filters as-is (CardPicker's unset-filter state)", async () => {
    await getCards({ page: 1, pageSize: 12, category: "", rarity: "" });

    const [url] = global.fetch.mock.calls[0];
    const query = new URLSearchParams(url.split("?")[1]);
    expect(query.get("category")).toBe("");
    expect(query.get("rarity")).toBe("");
  });
});
