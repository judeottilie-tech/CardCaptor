import { NavLink } from "react-router-dom";
import { logout } from "../managers/authManager";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  const handleLogout = (e) => {
    e.preventDefault();
    logout().then(() => {
      setLoggedInUser(null);
    });
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded hover:bg-slate-700 ${isActive ? "bg-slate-700" : ""}`;

  return (
    <nav className="flex items-center justify-between bg-slate-800 text-white px-4 py-3">
      <NavLink to="/" className="text-lg font-bold">
        Card Captor
      </NavLink>

      {loggedInUser ? (
        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            My Binder Pages
          </NavLink>
          <NavLink to="/binderpages/create" className={linkClass}>
            New Binder Page
          </NavLink>
          <span className="px-3 text-slate-300">{loggedInUser.displayName}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={linkClass}>
            Register
          </NavLink>
        </div>
      )}
    </nav>
  );
}
