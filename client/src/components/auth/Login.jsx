import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../managers/authManager";
import Heart from "../decor/heart";


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
    `w-full border rounded px-3 py-2 bg-white text-brand-ink focus:outline-none focus:border-brand-rose ${
      invalid ? "border-red-500" : "border-brand-periwinkle/40"
    }`;

  return (
    <div className="container mx-auto mt-8 px-4" style={{ maxWidth: "500px" }}>
      <div className="bg-white/5 rounded-2xl p-6 sm:p-8">
        <h3 className="inline-flex items-center gap-1.5 text-xl font-bold mb-4">
          Login
          <Heart className="h-4 w-4" color="#F59BAD" />
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="login-username" className="block mb-1">
              Username
            </label>
            <input
              id="login-username"
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
            <label htmlFor="login-password" className="block mb-1">
              Password
            </label>
            <input
              id="login-password"
              className={inputClass(failedLogin)}
              type="password"
              value={password}
              onChange={(e) => {
                setFailedLogin(false);
                setPassword(e.target.value);
              }}
            />
            {failedLogin && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                Login failed.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded bg-brand-rose hover:bg-brand-rose/90 text-brand-ink font-semibold"
          >
            Login
          </button>
        </form>
        <p className="mt-4">
          Not signed up?{" "}
          <Link
            to="/register"
            className="text-brand-sky underline decoration-2 underline-offset-2 hover:text-brand-lavender font-semibold"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
