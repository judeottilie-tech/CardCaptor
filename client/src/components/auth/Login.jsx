import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../managers/authManager";


export default function Login({ setLoggedInUser }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(userName, password).then((user) => {
      if (!user) {
        setFailedLogin(true);
      } else {
        setLoggedInUser(user);
        navigate("/");
      }
    });
  };

  const inputClass = (invalid) =>
    `w-full border rounded px-3 py-2 focus:outline-none focus:border-brand-rose ${
      invalid ? "border-red-500" : "border-brand-periwinkle/40"
    }`;

  return (
    <div className="container mx-auto" style={{ maxWidth: "500px" }}>
      <h3 className="text-xl font-bold mb-4">Login</h3>
      <div className="mb-4">
        <label className="block mb-1">Username</label>
        <input
          className={inputClass(failedLogin)}
          type="text"
          value={userName}
          onChange={(e) => {
            setFailedLogin(false);
            setUserName(e.target.value);
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input
          className={inputClass(failedLogin)}
          type="password"
          value={password}
          onChange={(e) => {
            setFailedLogin(false);
            setPassword(e.target.value);
          }}
        />
        {failedLogin && (
          <p className="text-red-500 text-sm mt-1">Login failed.</p>
        )}
      </div>

      <button
        className="px-4 py-2 rounded bg-brand-rose hover:bg-brand-rose/90 text-brand-ink font-semibold"
        onClick={handleSubmit}
      >
        Login
      </button>
      <p className="mt-4">
        Not signed up? Register <Link to="/register">here</Link>
      </p>
    </div>
  );
}
