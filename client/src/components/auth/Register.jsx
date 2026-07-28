import { useState } from "react";
import { register } from "../../managers/authManager";
import { Link, useNavigate } from "react-router-dom";
import { STARTER_LINES, getSpriteUrl } from "../../data/pokemonStarters";
import Sparkle from "../decor/sparkle";

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
    `w-full border rounded px-3 py-2 bg-white text-brand-ink focus:outline-none focus:border-brand-rose ${
      invalid ? "border-red-500" : "border-brand-periwinkle/40"
    }`;

  return (
    <div className="container mx-auto mt-8 px-4" style={{ maxWidth: "700px" }}>
      <div className="bg-white/5 rounded-2xl p-6 sm:p-8">
      <h3 className="inline-flex items-center gap-1.5 text-xl font-bold mb-4">
        Sign Up
        <Sparkle className="h-4 w-4" color="#778BBE" />
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="register-username" className="block mb-1">
            Username
          </label>
          <input
            id="register-username"
            className={inputClass(false)}
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="register-displayname" className="block mb-1">
            Display Name
          </label>
          <input
            id="register-displayname"
            className={inputClass(false)}
            type="text"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
            }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="register-password" className="block mb-1">
            Password
          </label>
          <input
            id="register-password"
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
          <label htmlFor="register-confirm-password" className="block mb-1">
            Confirm Password
          </label>
          <input
            id="register-confirm-password"
            className={inputClass(passwordMismatch)}
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setPasswordMismatch(false);
              setConfirmPassword(e.target.value);
            }}
          />
          {passwordMismatch && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              Passwords do not match!
            </p>
          )}
        </div>

        <fieldset className="mb-4">
          <legend className="block mb-1">Choose your starter</legend>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto border border-brand-periwinkle/40 rounded p-2">
            {STARTER_LINES.map((line) => (
              <button
                type="button"
                key={line.stage1}
                onClick={() => setStarterPokemon(line.stage1)}
                title={line.stage1}
                aria-pressed={starterPokemon === line.stage1}
                className={`flex flex-col items-center rounded p-1 hover:bg-brand-blush/30 ${
                  starterPokemon === line.stage1 ? "ring-2 ring-brand-rose bg-brand-blush/30" : ""
                }`}
              >
                <img src={getSpriteUrl(line.stage1)} alt={line.stage1} className="w-12 h-12" />
                <span className="text-xs">{line.stage1}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {registrationFailure && (
          <p className="text-red-500 mb-4" role="alert">
            Registration Failure
          </p>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-brand-rose hover:bg-brand-rose/90 text-brand-ink font-semibold disabled:opacity-50"
          disabled={passwordMismatch || !starterPokemon}
        >
          Register
        </button>
      </form>
      <p className="mt-4">
        Already signed up? Log in <Link to="/login">here</Link>
      </p>
      </div>
    </div>
  );
}
