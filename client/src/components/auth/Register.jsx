import { useState } from "react";
import { register } from "../../managers/authManager";
import { Link, useNavigate } from "react-router-dom";

export default function Register({ setLoggedInUser }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState();
  const [registrationFailure, setRegistrationFailure] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      const newUser = {
        userName,
        password,
        displayName,
      };
      register(newUser).then((user) => {
        if (user) {
          setLoggedInUser(user);
          navigate("/");
        } else {
          setRegistrationFailure(true);
        }
      });
    }
  };

  const inputClass = (invalid) =>
    `w-full border rounded px-3 py-2 ${invalid ? "border-red-500" : "border-slate-300"}`;

  return (
    <div className="container mx-auto" style={{ maxWidth: "500px" }}>
      <h3 className="text-xl font-bold mb-4">Sign Up</h3>

      <div className="mb-4">
        <label className="block mb-1">Username</label>
        <input
          className={inputClass(false)}
          type="text"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Display Name</label>
        <input
          className={inputClass(false)}
          type="text"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input
          className={inputClass(passwordMismatch)}
          type="password"
          value={password}
          onChange={(e) => {
            setPasswordMismatch(false);
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Confirm Password</label>
        <input
          className={inputClass(passwordMismatch)}
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setPasswordMismatch(false);
            setConfirmPassword(e.target.value);
          }}
        />
        {passwordMismatch && (
          <p className="text-red-500 text-sm mt-1">Passwords do not match!</p>
        )}
      </div>
      {registrationFailure && (
        <p className="text-red-500 mb-4">Registration Failure</p>
      )}
      <button
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
        onClick={handleSubmit}
        disabled={passwordMismatch}
      >
        Register
      </button>
      <p className="mt-4">
        Already signed up? Log in <Link to="/login">here</Link>
      </p>
    </div>
  );
}
