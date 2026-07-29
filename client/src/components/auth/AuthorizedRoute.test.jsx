import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthorizedRoute } from "./AuthorizedRoute";

function renderAt(path, loggedInUser) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <p>Secret Content</p>
            </AuthorizedRoute>
          }
        />
        <Route path="/login" element={<p>Login Page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AuthorizedRoute", () => {
  it("renders children when a user is logged in", () => {
    renderAt("/protected", { id: 1, displayName: "Ash" });

    expect(screen.getByText("Secret Content")).toBeInTheDocument();
  });

  it("redirects to /login when no user is logged in", () => {
    renderAt("/protected", null);

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Secret Content")).not.toBeInTheDocument();
  });
});
