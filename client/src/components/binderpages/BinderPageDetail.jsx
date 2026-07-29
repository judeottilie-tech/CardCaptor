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
  const [editing, setEditing] = useState(false);
  const [slotsSaving, setSlotsSaving] = useState(false);
  const [slotsJustSaved, setSlotsJustSaved] = useState(false);
  const [draggedSlotId, setDraggedSlotId] = useState(null);
  const [dragOverSlotId, setDragOverSlotId] = useState(null);

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

  const handleSlotDragStart = (slotId) => (e) => {
    setDraggedSlotId(slotId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(slotId));
  };

  const handleSlotDragEnd = () => {
    setDraggedSlotId(null);
    setDragOverSlotId(null);
  };

  const handleSlotDragOver = (slotId) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverSlotId !== slotId) setDragOverSlotId(slotId);
  };

  const handleSlotDragLeave = (slotId) => () => {
    setDragOverSlotId((current) => (current === slotId ? null : current));
  };

  const handleSlotDrop = (targetSlotId) => (e) => {
    e.preventDefault();
    const sourceSlotId = Number(e.dataTransfer.getData("text/plain"));
    setDraggedSlotId(null);
    setDragOverSlotId(null);
    if (!sourceSlotId || sourceSlotId === targetSlotId) return;

    setPendingSlots((slots) => {
      const source = slots.find((s) => s.id === sourceSlotId);
      const target = slots.find((s) => s.id === targetSlotId);
      if (!source || !target) return slots;
      return slots.map((s) => {
        if (s.id === sourceSlotId) return { ...s, cardId: target.cardId, card: target.card };
        if (s.id === targetSlotId) return { ...s, cardId: source.cardId, card: source.card };
        return s;
      });
    });
  };

  const handleSaveSlots = () => {
    setSlotsSaving(true);
    const slotUpdates = pendingSlots
      .filter((slot) => {
        const original = binderPage.binderPageCardSlots.find((s) => s.id === slot.id);
        return original.cardId !== slot.cardId;
      })
      .map((slot) => (slot.cardId ? attachCard(slot.id, slot.cardId) : removeCard(slot.id)));

    Promise.all(slotUpdates).then(() => {
      setSlotsSaving(false);
      loadBinderPage();
      setSlotsJustSaved(true);
      setTimeout(() => setSlotsJustSaved(false), 1500);
    });
  };

  const handleDeleteBinder = () => {
    if (!window.confirm(`Delete "${binderPage.title}"? This can't be undone.`)) return;
    deleteBinderPage(binderPage.id).then(() => navigate("/"));
  };

  const handleStartEdit = () => {
    setNewTitle(binderPage.title);
    setNewDescription(binderPage.description || "");
    setEditing(true);
  };

  const handleExitEdit = () => {
    setNewTitle(binderPage.title);
    setNewDescription(binderPage.description || "");
    setEditing(false);
  };

  const handleUpdateBinder = (e) => {
    e.preventDefault();
    setSaving(true);

    updateBinderPage(binderPage.id, { title: newTitle, description: newDescription }).then(() => {
      setSaving(false);
      setEditing(false);
      loadBinderPage();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    });
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
  const slotsDirty = pendingSlots.some((slot) => {
    const original = binderPage.binderPageCardSlots.find((s) => s.id === slot.id);
    return original.cardId !== slot.cardId;
  });

  return (
    <div className="mx-auto mt-4 sm:mt-8 px-4 max-w-2xl">
      <div className="bg-white/5 rounded-2xl p-4 sm:p-6 mb-4">
        {editing ? (
          <form onSubmit={handleUpdateBinder} className="flex flex-col gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="font-heading text-xl font-bold border border-brand-periwinkle/40 rounded px-2 py-1 bg-white text-brand-ink focus:outline-none focus:border-brand-rose"
              autoFocus
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Add a description or notes..."
              className="text-sm border border-brand-periwinkle/40 rounded px-2 py-1 bg-white text-brand-ink focus:outline-none focus:border-brand-rose"
            />
            <div className="flex justify-end items-center gap-2 mt-2">
              {justSaved && <span className="text-green-400 text-sm mr-auto">Saved</span>}
              <button
                type="button"
                onClick={handleExitEdit}
                className="px-3 py-1 rounded border border-brand-periwinkle/40 hover:bg-brand-blush/10"
              >
                Exit
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-3 py-1 rounded bg-brand-rose text-brand-ink font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h1 className="font-heading text-xl font-bold truncate">{binderPage.title}</h1>
              {binderPage.description && (
                <p className="text-sm text-brand-cream/60 mt-1">{binderPage.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleStartEdit}
                className="px-3 py-1 rounded bg-brand-rose text-brand-ink font-semibold"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDeleteBinder}
                className="px-3 py-1 rounded border border-red-400 text-red-400 hover:bg-red-400/10"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className="bg-white/5 rounded-2xl p-4 sm:p-6 mx-auto"
        style={{ maxWidth: "clamp(240px, calc((100vh - 260px) / 1.35), 38rem)" }}
      >
        <div className="flex justify-end items-center gap-2 mb-3">
          {slotsJustSaved && <span className="text-green-400 text-sm mr-auto">Saved</span>}
          <button
            type="button"
            onClick={handleSaveSlots}
            disabled={!slotsDirty || slotsSaving}
            className={`px-3 py-1 rounded font-semibold text-sm transition-colors ${
              slotsDirty
                ? "bg-brand-rose text-brand-ink"
                : "bg-black/10 text-brand-cream/30 cursor-not-allowed"
            }`}
          >
            {slotsSaving ? "Saving..." : "Save"}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {sortedSlots.map((slot) => (
            <CardSlot
              key={slot.id}
              slot={slot}
              onSelect={() => handleSelectSlot(slot.id)}
              onRemove={() => handleRemoveCard(slot.id)}
              onDragStart={slot.card ? handleSlotDragStart(slot.id) : undefined}
              onDragEnd={handleSlotDragEnd}
              onDragOver={handleSlotDragOver(slot.id)}
              onDragLeave={handleSlotDragLeave(slot.id)}
              onDrop={handleSlotDrop(slot.id)}
              isDragging={draggedSlotId === slot.id}
              isDragOver={dragOverSlotId === slot.id && draggedSlotId !== slot.id}
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
