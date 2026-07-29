import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, register, tryGetLoggedInUser } from "./authManager";

function mockFetchOnce(status, body) {
  global.fetch = vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  });
}

describe("authManager", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("login returns null on a non-200 response without calling /me", async () => {
    mockFetchOnce(401, null);

    const result = await login("baduser", "badpass");

    expect(result).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("login fetches the current user on a 200 response", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ status: 200, ok: true })
      .mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ id: 1, displayName: "Ash" }),
      });

    const result = await login("ash", "pikachu");

    expect(result).toEqual({ id: 1, displayName: "Ash" });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("register does NOT report success when the server rejects registration", async () => {

    mockFetchOnce(400, "Invalid starter Pokemon.");

    const result = await register({
      userName: "newuser",
      password: "pw",
      displayName: "New User",
      starterPokemon: "NotReal",
    });

    expect(result).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("register fetches the current user on success", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ status: 200, ok: true })
      .mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ id: 2, displayName: "New User" }),
      });

    const result = await register({
      userName: "newuser",
      password: "pw",
      displayName: "New User",
      starterPokemon: "Bulbasaur",
    });

    expect(result).toEqual({ id: 2, displayName: "New User" });
  });

  it("register base64-encodes the password before sending it", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ status: 200, ok: true })
      .mockResolvedValueOnce({ status: 200, json: () => Promise.resolve({}) });

    await register({ userName: "u", password: "plaintext", displayName: "D", starterPokemon: "Bulbasaur" });

    const [, requestInit] = global.fetch.mock.calls[0];
    const sentBody = JSON.parse(requestInit.body);
    expect(sentBody.password).toBe(btoa("plaintext"));
  });

  it("tryGetLoggedInUser resolves null on a 401 instead of parsing a body", async () => {
    mockFetchOnce(401, null);

    const result = await tryGetLoggedInUser();

    expect(result).toBeNull();
  });
});
