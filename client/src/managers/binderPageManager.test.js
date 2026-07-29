import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getBinderPages,
  getBinderPageById,
  createBinderPage,
  updateBinderPage,
  deleteBinderPage,
} from "./binderPageManager";

describe("binderPageManager", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getBinderPages fetches the list endpoint and parses JSON", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([{ id: 1, title: "Page 1" }]),
    });

    const result = await getBinderPages();

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/binderpage",
      expect.objectContaining({ credentials: "include" }),
    );
    expect(result).toEqual([{ id: 1, title: "Page 1" }]);
  });

  it("getBinderPageById returns null instead of parsing JSON on a non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    const result = await getBinderPageById(999);

    expect(result).toBeNull();
  });

  it("createBinderPage always parses the response as JSON", async () => {
   
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 5, title: "New Page" }),
    });

    const result = await createBinderPage({ title: "New Page" });

    expect(result).toEqual({ id: 5, title: "New Page" });
  });

  it("updateBinderPage PUTs to the page-specific URL", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    await updateBinderPage(3, { title: "Renamed" });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/binderpage/3",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("deleteBinderPage DELETEs to the page-specific URL", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    await deleteBinderPage(7);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/binderpage/7",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
