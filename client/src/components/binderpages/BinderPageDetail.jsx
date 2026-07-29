import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getBinderPageById,
  updateBinderPage,
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

  const goToDashboard = () => navigate("/");

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
    <div className="relative mt-2 sm:mt-4">
      <button
        type="button"
        onClick={goToDashboard}
        className="inline-flex items-center gap-1 ml-4 mb-4 md:ml-0 md:mb-0 md:absolute md:top-0 md:left-4 px-3 py-1.5 rounded-lg border border-brand-periwinkle/40 text-sm font-semibold hover:bg-brand-blush/10"
      >
        <span aria-hidden="true">&larr;</span> Back to Dashboard
      </button>

      <div className="mx-auto px-4 max-w-2xl">
      <div
        className="bg-white/5 rounded-2xl p-3 sm:p-4 mb-3 mx-auto"
        style={{ maxWidth: "clamp(240px, calc((100vh - 260px) / 1.35), 38rem)" }}
      >
        <div className="relative min-w-0 border border-brand-periwinkle/30 rounded-xl p-2 sm:p-3">
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
              <>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  aria-label="Edit title and description"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
                <h1 className="font-heading text-xl font-bold truncate pr-8">{binderPage.title}</h1>
                {binderPage.description && (
                  <p className="text-sm text-brand-cream/60 mt-1 pr-8">{binderPage.description}</p>
                )}
              </>
            )}
          </div>
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
        {slotsJustSaved && (
          <p className="text-green-400 text-sm font-semibold text-center mt-4">Saved!</p>
        )}
        <div className="flex justify-between items-center gap-3 mt-4 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={goToDashboard}
            className="px-5 py-2 rounded-lg border-2 border-brand-periwinkle text-brand-cream font-semibold hover:bg-brand-blush/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveSlots}
            disabled={!slotsDirty || slotsSaving}
            className={`px-6 py-2 rounded-lg font-bold text-base transition-colors ${
              slotsDirty
                ? "bg-brand-rose text-white border-2 border-white/40 shadow-lg hover:brightness-110"
                : "bg-white/5 text-brand-cream/40 border border-white/10 cursor-not-allowed"
            }`}
          >
            {slotsSaving ? "Saving..." : "Save"}
          </button>
        </div>
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
