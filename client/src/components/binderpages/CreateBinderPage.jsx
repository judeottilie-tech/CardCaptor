import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBinderPage } from "../../managers/binderPageManager";

export default function CreateBinderPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateBinderPage = (event) => {
    event.preventDefault();
    const newBinderPage = { title, description };
    createBinderPage(newBinderPage).then((created) => {
      navigate(`/binderpages/${created.id}`);
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 px-4">
      <div className="bg-white/5 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-4">Create Binder Page</h2>
        <form onSubmit={handleCreateBinderPage}>
          <div className="mb-4">
            <label htmlFor="binderpage-title" className="block mb-1">
              Title
            </label>
            <input
              id="binderpage-title"
              required
              className="w-full border border-brand-periwinkle/40 rounded px-3 py-2 bg-white text-brand-ink focus:outline-none focus:border-brand-rose"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="binderpage-description" className="block mb-1">
              Description <span className="text-brand-cream/50 font-normal">(optional)</span>
            </label>
            <textarea
              id="binderpage-description"
              rows={2}
              className="w-full border border-brand-periwinkle/40 rounded px-3 py-2 bg-white text-brand-ink focus:outline-none focus:border-brand-rose resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes about this binder page..."
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-brand-rose hover:bg-brand-rose/90 text-brand-ink font-semibold"
          >
            Create Binder Page
          </button>
        </form>
      </div>
    </div>
  );
}
