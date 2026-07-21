import { useState } from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../managers/authManager";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = (e) => {
    e.preventDefault();
    logout().then(() => {
      setLoggedInUser(null);
    });
    closeMenu();
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded hover:bg-slate-700 ${isActive ? "bg-slate-700" : ""}`;

  const navLinks = loggedInUser ? (
    <>
      <NavLink to="/" className={linkClass} onClick={closeMenu}>
        My Binder Pages
      </NavLink>
      <NavLink to="/binderpages/create" className={linkClass} onClick={closeMenu}>
        New Binder Page
      </NavLink>
      <span className="px-3 text-slate-300">{loggedInUser.displayName}</span>
      <button
        onClick={handleLogout}
        className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-left"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <NavLink to="/login" className={linkClass} onClick={closeMenu}>
        Login
      </NavLink>
      <NavLink to="/register" className={linkClass} onClick={closeMenu}>
        Register
      </NavLink>
    </>
  );

  return (
    <nav className="bg-slate-800 text-white px-4 py-3">
      <div className="flex items-center justify-between">
        <NavLink to="/" className="text-lg font-bold hover:text-slate-300" onClick={closeMenu}>
          Card Captor
        </NavLink>

        <div className="hidden sm:flex items-center gap-2">{navLinks}</div>

        <button
          className="sm:hidden px-2 py-1 rounded hover:bg-slate-700 text-xl leading-none"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-1 mt-2">{navLinks}</div>
      )}
    </nav>
  );
}
