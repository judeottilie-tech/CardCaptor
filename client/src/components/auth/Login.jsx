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

  const fillDemoAccount = () => {
    setFailedLogin(false);
    setUserName("DemoUser");
    setPassword("Demo1234");
  };

  const inputClass = (invalid) =>
    `w-full border rounded px-3 py-2 ${invalid ? "border-red-500" : "border-slate-300"}`;

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
        {failedLogin && <p className="text-red-500 text-sm mt-1">Login failed.</p>}
      </div>

      <button
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
        onClick={handleSubmit}
      >
        Login
      </button>
      <button
        type="button"
        className="px-4 py-2 rounded border border-slate-300 hover:bg-slate-100 ml-2"
        onClick={fillDemoAccount}
      >
        Try Demo
      </button>
      <p className="mt-4">
        Not signed up? Register <Link to="/register">here</Link>
      </p>
    </div>
  );
}
