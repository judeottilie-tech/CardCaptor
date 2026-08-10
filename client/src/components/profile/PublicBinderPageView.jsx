import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicBinderPage } from "../../managers/binderPageManager";

export default function PublicBinderPageView() {
  const { userName, id } = useParams();
  const [binderPage, setBinderPage] = useState();

  useEffect(() => {
    const controller = new AbortController();
    getPublicBinderPage(id, controller.signal)
      .then(setBinderPage)
      .catch((err) => {
        if (err.name !== "AbortError") throw err;
      });
    return () => controller.abort();
  }, [id]);

  if (binderPage === undefined) return <p className="text-center mt-8">Loading...</p>;

  if (binderPage === null) {
    return (
      <div className="max-w-2xl mx-auto mt-8 px-4 text-center">
        <p className="text-lg mb-4">This binder page isn't public (or doesn't exist).</p>
        <Link
          to={`/u/${userName}`}
          className="text-brand-cream underline decoration-brand-periwinkle/50 hover:text-brand-lavender"
        >
          Back to profile
        </Link>
      </div>
    );
  }

  const sortedSlots = [...binderPage.binderPageCardSlots].sort((a, b) => a.position - b.position);

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <Link
        to={`/u/${userName}`}
        className="inline-flex items-center gap-1 mb-4 text-sm text-brand-cream/60 hover:text-brand-cream"
      >
        <span aria-hidden="true">&larr;</span> Back to @{userName}'s profile
      </Link>

      <div className="bg-white/5 rounded-2xl p-4 mb-3">
        <h1 className="font-heading text-xl font-bold">{binderPage.title}</h1>
        {binderPage.description && (
          <p className="text-sm text-brand-cream/60 mt-1">{binderPage.description}</p>
        )}
      </div>

      <div className="bg-white/5 rounded-2xl p-4 sm:p-6">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${binderPage.columns}, minmax(0, 1fr))` }}
        >
          {sortedSlots.map((slot) => (
            <div
              key={slot.id}
              className="min-w-0 min-h-0 aspect-[5/7] border rounded overflow-hidden border-brand-periwinkle/30"
            >
              {slot.card && (
                <img
                  src={slot.card.imageUrl}
                  alt={slot.card.name}
                  draggable={false}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
