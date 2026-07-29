import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import * as authManager from "../../managers/authManager";

describe("Login", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("submits the entered username/password and logs in on success", async () => {
    const loginSpy = vi.spyOn(authManager, "login").mockResolvedValue({ id: 1, displayName: "Ash" });
    const setLoggedInUser = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login setLoggedInUser={setLoggedInUser} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("Username"), "ash");
    await user.type(screen.getByLabelText("Password"), "pikachu");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(loginSpy).toHaveBeenCalledWith("ash", "pikachu");
    await waitFor(() => expect(setLoggedInUser).toHaveBeenCalledWith({ id: 1, displayName: "Ash" }));
  });

  it("shows an error message and does not log in when login() resolves null", async () => {
    vi.spyOn(authManager, "login").mockResolvedValue(null);
    const setLoggedInUser = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login setLoggedInUser={setLoggedInUser} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("Username"), "ash");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Login failed.");
    expect(setLoggedInUser).not.toHaveBeenCalled();
  });

  it("submits via Enter key in the password field, not just a button click", async () => {
    const loginSpy = vi.spyOn(authManager, "login").mockResolvedValue({ id: 1, displayName: "Ash" });
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login setLoggedInUser={vi.fn()} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("Username"), "ash");
    await user.type(screen.getByLabelText("Password"), "pikachu{Enter}");

    expect(loginSpy).toHaveBeenCalledWith("ash", "pikachu");
  });
});
