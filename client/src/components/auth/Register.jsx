import { useState } from "react";
import { register } from "../../managers/authManager";
import { Link, useNavigate } from "react-router-dom";
import { STARTER_LINES, getSpriteUrl } from "../../data/pokemonStarters";

export default function Register({ setLoggedInUser }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState();
  const [registrationFailure, setRegistrationFailure] = useState(false);
  const [starterPokemon, setStarterPokemon] = useState("");

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
        starterPokemon,
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
    `w-full border rounded px-3 py-2 focus:outline-none focus:border-brand-rose ${
      invalid ? "border-red-500" : "border-brand-periwinkle/40"
    }`;

  return (
    <div className="container mx-auto" style={{ maxWidth: "700px" }}>
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

      <div className="mb-4">
        <label className="block mb-1">Choose your starter</label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto border border-brand-periwinkle/40 rounded p-2">
          {STARTER_LINES.map((line) => (
            <button
              type="button"
              key={line.stage1}
              onClick={() => setStarterPokemon(line.stage1)}
              title={line.stage1}
              className={`flex flex-col items-center rounded p-1 hover:bg-brand-blush/30 ${
                starterPokemon === line.stage1 ? "ring-2 ring-brand-rose bg-brand-blush/30" : ""
              }`}
            >
              <img src={getSpriteUrl(line.stage1)} alt={line.stage1} className="w-12 h-12" />
              <span className="text-xs">{line.stage1}</span>
            </button>
          ))}
        </div>
      </div>

      {registrationFailure && (
        <p className="text-red-500 mb-4">Registration Failure</p>
      )}
      <button
        className="px-4 py-2 rounded bg-brand-rose hover:bg-brand-rose/90 text-brand-ink font-semibold disabled:opacity-50"
        onClick={handleSubmit}
        disabled={passwordMismatch || !starterPokemon}
      >
        Register
      </button>
      <p className="mt-4">
        Already signed up? Log in <Link to="/login">here</Link>
      </p>
    </div>
  );
}
