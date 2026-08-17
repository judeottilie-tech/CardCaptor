import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfile } from "../../managers/profileManager";
import { getSpriteUrl } from "../../data/pokemonStarters";

export default function PublicProfile() {
  const { userName } = useParams();
  const [profile, setProfile] = useState();

  useEffect(() => {
    const controller = new AbortController();
    getProfile(userName, controller.signal)
      .then(setProfile)
      .catch((err) => {
        if (err.name !== "AbortError") throw err;
      });
    return () => controller.abort();
  }, [userName]);

  if (profile === undefined) return <p className="text-center mt-8">Loading...</p>;

  if (profile === null) {
    return (
      <div className="max-w-2xl mx-auto mt-8 px-4 text-center">
        <p className="text-lg">No profile found for "{userName}".</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="bg-white/5 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center mb-6">
        <img
          src={getSpriteUrl(profile.currentPokemon)}
          alt={profile.currentPokemon}
          draggable={false}
          className="h-24 w-24 object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]"
        />
        <h1 className="font-heading text-2xl font-bold mt-2">{profile.displayName}</h1>
        <p className="text-sm text-brand-cream/50">@{profile.userName}</p>
      </div>

      <h2 className="font-heading text-lg font-bold mb-3">Public Binder Pages</h2>
      {profile.binderPages.length === 0 ? (
        <p className="text-brand-cream/60 mb-6">This user hasn't made any binder pages public yet.</p>
      ) : (
        <ul className="flex flex-col gap-2 mb-6">
          {profile.binderPages.map((bp) => (
            <li key={bp.id}>
              <Link
                to={`/u/${profile.userName}/${bp.id}`}
                className="flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{bp.title}</p>
                  {bp.description && (
                    <p className="text-sm text-brand-cream/60 truncate">{bp.description}</p>
                  )}
                </div>
                <span className="shrink-0 text-sm text-brand-cream/50">
                  <span aria-hidden="true">♡</span> {bp.likeCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {profile.likedPages.length > 0 && (
        <>
          <h2 className="font-heading text-lg font-bold mb-3">Liked Pages</h2>
          <ul className="flex flex-col gap-2">
            {profile.likedPages.map((bp) => (
              <li key={bp.id}>
                <Link
                  to={`/u/${bp.ownerUserName}/${bp.id}`}
                  className="block bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors"
                >
                  <p className="font-semibold">{bp.title}</p>
                  <p className="text-sm text-brand-cream/60">by {bp.ownerDisplayName}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
