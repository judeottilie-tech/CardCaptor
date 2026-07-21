import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBinderPage } from "../../managers/binderPageManager";

export default function CreateBinderPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const handleCreateBinderPage = (event) => {
    event.preventDefault();
    const newBinderPage = { title };
    createBinderPage(newBinderPage).then((created) => {
      navigate(`/binderpages/${created.id}`);
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 px-4">
      <h2 className="text-xl font-bold mb-4">Create Binder Page</h2>
      <form onSubmit={handleCreateBinderPage}>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            className="w-full border border-slate-300 rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white"
        >
          Create Binder Page
        </button>
      </form>
    </div>
  );
}
