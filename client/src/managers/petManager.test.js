import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPet, feedPet } from "./petManager";

describe("petManager", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getPet fetches the pet endpoint", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ currentPokemon: "Bulbasaur" }),
    });

    const result = await getPet();

    expect(global.fetch).toHaveBeenCalledWith("/api/pet", expect.objectContaining({ credentials: "include" }));
    expect(result).toEqual({ currentPokemon: "Bulbasaur" });
  });

  it("feedPet POSTs to the feed sub-route", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ feedCount: 1, evolved: false }),
    });

    const result = await feedPet();

    expect(global.fetch).toHaveBeenCalledWith("/api/pet/feed", expect.objectContaining({ method: "POST" }));
    expect(result).toEqual({ feedCount: 1, evolved: false });
  });
});
