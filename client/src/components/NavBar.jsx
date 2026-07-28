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
    `px-3 py-2 rounded hover:bg-brand-cream/10 ${isActive ? "bg-brand-cream/15" : ""}`;

  const navLinks = loggedInUser ? (
    <>
      <NavLink to="/" className={linkClass} onClick={closeMenu}>
        My Binder Pages
      </NavLink>
      <NavLink to="/binderpages/create" className={linkClass} onClick={closeMenu}>
        New Binder Page
      </NavLink>
      <span className="px-3 text-brand-cream/70">{loggedInUser.displayName}</span>
      <button
        onClick={handleLogout}
        className="px-3 py-2 rounded border border-brand-rose text-brand-rose hover:bg-brand-rose/10 font-semibold text-left"
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
    <nav className="bg-brand-ink text-brand-cream px-4 py-3 relative">
      <div
        className="absolute left-0 right-0 bottom-0 h-[3px]"
        style={{
          background:
            "linear-gradient(to right, #FAB323, #FEFA04, #76F4BD, #2AD3DC, #C2BBFA, #7971FC, #F913DE, #FD8CEA)",
        }}
        aria-hidden="true"
      />
      <div className="flex items-center justify-between">
        <NavLink
          to="/"
          className="font-heading text-lg font-bold hover:text-brand-blush"
          onClick={closeMenu}
        >
          CardCaptor
        </NavLink>

        <div className="hidden sm:flex items-center gap-2">{navLinks}</div>

        <button
          className="sm:hidden px-2 py-1 rounded hover:bg-brand-cream/10 text-xl leading-none"
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
