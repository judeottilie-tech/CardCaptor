import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBinderPages, deleteBinderPage } from "../../managers/binderPageManager";

export default function BinderPageList() {
  const [binderPages, setBinderPages] = useState([]);

  const loadBinderPages = (signal) => getBinderPages(signal).then(setBinderPages);

  useEffect(() => {
    const controller = new AbortController();
    loadBinderPages(controller.signal).catch((err) => {
      if (err.name !== "AbortError") throw err;
    });
    return () => controller.abort();
  }, []);

  const handleDelete = (id, title) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    deleteBinderPage(id).then(() => loadBinderPages());
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Binder Pages</h2>
        <Link
          to="/binderpages/create"
          className="px-4 py-2 rounded bg-brand-rose hover:bg-brand-rose/90 text-brand-ink font-semibold"
        >
          + New Binder Page
        </Link>
      </div>
      {binderPages.length === 0 ? (
        <p className="inline-flex items-center gap-1.5 text-brand-cream/60">
          You don't have any binder pages yet — create one to get started.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {binderPages.map((bp) => (
            <li
              key={bp.id}
              className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl px-5 py-4 flex justify-between items-center gap-4"
            >
              <Link to={`/binderpages/${bp.id}`} className="min-w-0 flex-1">
                <p className="font-semibold text-brand-cream hover:text-brand-lavender truncate">
                  {bp.title}
                </p>
                {bp.description && (
                  <p className="text-sm text-brand-cream/50 truncate mt-0.5">
                    {bp.description}
                  </p>
                )}
              </Link>
              <button
                className="px-2 py-1 rounded border border-red-400 text-red-400 hover:bg-red-400/10 text-sm shrink-0"
                onClick={() => handleDelete(bp.id, bp.title)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
