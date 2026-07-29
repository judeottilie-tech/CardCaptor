import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { GuestRoute } from "./GuestRoute";

function renderAt(path, loggedInUser) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute loggedInUser={loggedInUser}>
              <p>Login Form</p>
            </GuestRoute>
          }
        />
        <Route path="/" element={<p>Dashboard</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("GuestRoute", () => {
  it("renders children when nobody is logged in", () => {
    renderAt("/login", null);

    expect(screen.getByText("Login Form")).toBeInTheDocument();
  });

  it("redirects to / when a user is already logged in", () => {
    // Regression test: /login and /register used to render unconditionally,
    // so an already-authenticated user could still navigate there.
    renderAt("/login", { id: 1, displayName: "Ash" });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Login Form")).not.toBeInTheDocument();
  });
});
