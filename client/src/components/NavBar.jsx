import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../managers/authManager";
import { getPortraitUrl } from "../data/pokemonStarters";

export default function NavBar({ loggedInUser, setLoggedInUser, pet }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) closeMenu();
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleLogout = (e) => {
    e.preventDefault();
    logout().then(() => {
      setLoggedInUser(null);
    });
    closeMenu();
  };

  const menuLinkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-brand-cream/10 ${isActive ? "bg-brand-cream/15" : ""}`;

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
        <NavLink to="/" className="font-heading text-lg font-bold hover:text-brand-blush">
          CardCaptor
        </NavLink>

        {loggedInUser ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Account menu"
              aria-expanded={menuOpen}
              className="h-9 w-9 rounded-full overflow-hidden bg-brand-cream/10 hover:ring-2 hover:ring-brand-rose transition-all flex items-center justify-center"
            >
              {pet && (
                <img
                  src={getPortraitUrl(pet.currentPokemon)}
                  alt={pet.currentPokemon}
                  className="h-full w-full object-cover"
                />
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-brand-ink border border-brand-cream/10 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-cream/10">
                  {pet && (
                    <img
                      src={getPortraitUrl(pet.currentPokemon)}
                      alt={pet.currentPokemon}
                      className="h-10 w-10 rounded-full object-cover shrink-0"
                    />
                  )}
                  <p className="font-semibold truncate">{loggedInUser.displayName}</p>
                </div>

                <div className="py-1">
                  <NavLink to="/" className={menuLinkClass} onClick={closeMenu}>
                    My Binder Pages
                  </NavLink>
                  <NavLink
                    to="/binderpages/create"
                    className={menuLinkClass}
                    onClick={closeMenu}
                  >
                    New Binder Page
                  </NavLink>
                </div>

                <div className="border-t border-brand-cream/10 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded hover:bg-brand-rose/10 text-brand-rose font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className="px-3 py-2 rounded hover:bg-brand-cream/10"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="px-3 py-2 rounded hover:bg-brand-cream/10"
            >
              Register
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
