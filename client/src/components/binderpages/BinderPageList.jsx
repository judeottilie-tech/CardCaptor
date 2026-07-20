import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBinderPages, deleteBinderPage } from "../../managers/binderPageManager";

export default function BinderPageList() {
  const [binderPages, setBinderPages] = useState([]);

  const loadBinderPages = () => getBinderPages().then(setBinderPages);

  useEffect(() => {
    loadBinderPages();
  }, []);

  const handleDelete = (id, title) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    deleteBinderPage(id).then(loadBinderPages);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Binder Pages</h2>
        <Link
          to="/binderpages/create"
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white"
        >
          + New Binder Page
        </Link>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left border-b py-2">Title</th>
            <th className="border-b py-2"></th>
          </tr>
        </thead>
        <tbody>
          {binderPages.map((bp) => (
            <tr key={bp.id}>
              <td className="border-b py-2">
                <Link to={`/binderpages/${bp.id}`} className="text-blue-600 hover:underline">
                  {bp.title}
                </Link>
              </td>
              <td className="border-b py-2 text-right">
                <button
                  className="px-2 py-1 rounded border border-red-600 text-red-600 hover:bg-red-50 text-sm"
                  onClick={() => handleDelete(bp.id, bp.title)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
