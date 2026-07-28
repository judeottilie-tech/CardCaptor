import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getBinderPageById,
  updateBinderPage,
  deleteBinderPage,
} from "../../managers/binderPageManager";
import { attachCard, removeCard } from "../../managers/binderPageCardSlotManager";
import CardSlot from "./CardSlot";
import CardPicker from "./CardPicker";

export default function BinderPageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [binderPage, setBinderPage] = useState();
  const [pendingSlots, setPendingSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadBinderPage = (signal) => {
    return getBinderPageById(id, signal).then((bp) => {
      setBinderPage(bp);
      if (bp) {
        setNewTitle(bp.title);
        setNewDescription(bp.description || "");
        setPendingSlots(bp.binderPageCardSlots);
      }
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    loadBinderPage(controller.signal).catch((err) => {
      if (err.name !== "AbortError") throw err;
    });
    return () => controller.abort();
  }, [id]);

  const handleSelectSlot = (slotId) => {
    setSelectedSlotId(slotId);
  };
  
  const handleClosePicker = () => {
    setSelectedSlotId(null);
  };  

  const handlePickCard = (card) => {
    setPendingSlots((slots) =>
      slots.map((s) => (s.id === selectedSlotId ? { ...s, cardId: card.id, card } : s)),
    );
    setSelectedSlotId(null);
  };

  const handleRemoveCard = (slotId) => {
    setPendingSlots((slots) =>
      slots.map((s) => (s.id === slotId ? { ...s, cardId: null, card: null } : s)),
    );
  };

  const handleDeleteBinder = () => {
    if (!window.confirm(`Delete "${binderPage.title}"? This can't be undone.`)) return;
    deleteBinderPage(binderPage.id).then(() => navigate("/"));
  };

  const handleUpdateBinder = (e) => {
    e.preventDefault();
    setSaving(true);

    const slotUpdates = pendingSlots
      .filter((slot) => {
        const original = binderPage.binderPageCardSlots.find((s) => s.id === slot.id);
        return original.cardId !== slot.cardId;
      })
      .map((slot) => (slot.cardId ? attachCard(slot.id, slot.cardId) : removeCard(slot.id)));

    Promise.all([
      updateBinderPage(binderPage.id, { title: newTitle, description: newDescription }),
      ...slotUpdates,
    ]).then(
      () => {
        setSaving(false);
        loadBinderPage();
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 1500);
      },
    );
  };


  if (binderPage === undefined) return <p>Loading...</p>;

  if (binderPage === null) {
    return (
      <div className="max-w-2xl mx-auto mt-8 px-4 text-center">
        <p className="text-lg mb-4">Binder page not found.</p>
        <Link
          to="/"
          className="text-brand-cream underline decoration-brand-periwinkle/50 hover:text-brand-lavender"
        >
          Back to My Binder Pages
        </Link>
      </div>
    );
  }

  const sortedSlots = [...pendingSlots].sort((a, b) => a.position - b.position);

  return (
    <div className="mx-auto mt-4 sm:mt-8 px-4 max-w-2xl">
      <div className="bg-white/5 rounded-2xl p-4 sm:p-6 mb-4">
        <form onSubmit={handleUpdateBinder} className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="font-heading text-xl font-bold border border-brand-periwinkle/40 rounded px-2 py-1 flex-1 min-w-0 bg-white text-brand-ink focus:outline-none focus:border-brand-rose"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none px-3 py-1 rounded bg-brand-rose text-brand-ink font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleDeleteBinder}
                className="flex-1 sm:flex-none px-3 py-1 rounded border border-red-400 text-red-400 hover:bg-red-400/10"
              >
                Delete
              </button>
              {justSaved && <span className="text-green-400 text-sm">Saved</span>}
            </div>
          </div>
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Add a description or notes..."
            className="text-sm border border-brand-periwinkle/40 rounded px-2 py-1 bg-white text-brand-ink focus:outline-none focus:border-brand-rose"
          />
        </form>
      </div>

      <div
        className="bg-white/5 rounded-2xl p-4 sm:p-6 mx-auto"
        style={{ maxWidth: "clamp(240px, calc((100vh - 260px) / 1.35), 38rem)" }}
      >
        <div className="grid grid-cols-3 gap-1">
          {sortedSlots.map((slot) => (
            <CardSlot
              key={slot.id}
              slot={slot}
              onSelect={() => handleSelectSlot(slot.id)}
              onRemove={() => handleRemoveCard(slot.id)}
            />
          ))}
        </div>
      </div>

      {selectedSlotId && (
        <CardPicker
          onPick={handlePickCard}
          onClose={handleClosePicker}
          currentCard={sortedSlots.find((s) => s.id === selectedSlotId)?.card}
        />
      )}
    </div>
  );
}
