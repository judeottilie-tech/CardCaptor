import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getBinderPageById,
  updateBinderPage,
  updateBinderPageLayout,
} from "../../managers/binderPageManager";
import { attachCard, removeCard } from "../../managers/binderPageCardSlotManager";
import { getSideboard, addToSideboard, removeFromSideboard } from "../../managers/sideboardManager";
import { LAYOUTS } from "../../data/binderPageLayouts";
import CardSlot from "./CardSlot";
import CardPicker from "./CardPicker";
import Sideboard from "./Sideboard";

export default function BinderPageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [binderPage, setBinderPage] = useState();
  const [pendingSlots, setPendingSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [sideboard, setSideboard] = useState([]);
  const [pendingSideboardAdds, setPendingSideboardAdds] = useState([]);
  const [pendingSideboardRemovals, setPendingSideboardRemovals] = useState([]);
  const [selectedSideboardEntryId, setSelectedSideboardEntryId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIsPublic, setNewIsPublic] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [slotsSaving, setSlotsSaving] = useState(false);
  const [slotsJustSaved, setSlotsJustSaved] = useState(false);
  const [draggedSlotId, setDraggedSlotId] = useState(null);
  const [dragOverSlotId, setDragOverSlotId] = useState(null);
  const [draggedSideboardEntryId, setDraggedSideboardEntryId] = useState(null);
  const [dragOverSideboard, setDragOverSideboard] = useState(false);
  const [changingLayout, setChangingLayout] = useState(false);
  const [layoutSaving, setLayoutSaving] = useState(false);

  const loadBinderPage = (signal) => {
    return getBinderPageById(id, signal).then((bp) => {
      setBinderPage(bp);
      if (bp) {
        setNewTitle(bp.title);
        setNewDescription(bp.description || "");
        setNewIsPublic(bp.isPublic);
        setPendingSlots(bp.binderPageCardSlots);
      }
    });
  };

  const loadSideboard = () => getSideboard(id).then(setSideboard);

  useEffect(() => {
    const controller = new AbortController();
    loadBinderPage(controller.signal).catch((err) => {
      if (err.name !== "AbortError") throw err;
    });
    loadSideboard();
    return () => controller.abort();
  }, [id]);

  const sideboardEntries = [
    ...sideboard
      .filter((sc) => !pendingSideboardRemovals.includes(sc.id))
      .map((sc) => ({ id: sc.id, card: sc.card, isPending: false })),
    ...pendingSideboardAdds.map((a) => ({ id: a.tempId, card: a.card, isPending: true })),
  ];

  const handleSendToSideboard = (slotId) => {
    const slot = pendingSlots.find((s) => s.id === slotId);
    if (!slot?.card) return;
    setPendingSideboardAdds((adds) => [
      ...adds,
      { tempId: `pending-${Date.now()}-${slot.card.id}`, card: slot.card },
    ]);
    setPendingSlots((slots) =>
      slots.map((s) => (s.id === slotId ? { ...s, cardId: null, card: null } : s)),
    );
  };

  const handlePlaceFromSideboard = (slotId, entry) => {
    setPendingSlots((slots) =>
      slots.map((s) => (s.id === slotId ? { ...s, cardId: entry.card.id, card: entry.card } : s)),
    );
    if (entry.isPending) {
      setPendingSideboardAdds((adds) => adds.filter((a) => a.tempId !== entry.id));
    } else {
      setPendingSideboardRemovals((removals) => [...removals, entry.id]);
    }
    setSelectedSideboardEntryId(null);
  };

  const handleDiscardSideboardEntry = (entry) => {
    if (entry.isPending) {
      setPendingSideboardAdds((adds) => adds.filter((a) => a.tempId !== entry.id));
    } else {
      removeFromSideboard(entry.id).then(loadSideboard);
    }
    if (selectedSideboardEntryId === entry.id) setSelectedSideboardEntryId(null);
  };

  const dragStateRef = useRef({
    startX: 0,
    startY: 0,
    source: null,
    dragging: false,
    overSlotId: null,
    overSideboard: false,
  });
  const suppressClickRef = useRef(false);

  const handleSelectSlot = (slotId) => {
    if (suppressClickRef.current) return;

    const slot = pendingSlots.find((s) => s.id === slotId);
    if (selectedSideboardEntryId && slot && !slot.cardId) {
      const entry = sideboardEntries.find((e) => e.id === selectedSideboardEntryId);
      if (entry) {
        handlePlaceFromSideboard(slotId, entry);
        return;
      }
    }

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

  const swapSlots = (sourceSlotId, targetSlotId) => {
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

  const handleSlotPointerDown = (slotId) => (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      source: { type: "slot", id: slotId },
      dragging: false,
      overSlotId: null,
      overSideboard: false,
    };
  };

  const handleSideboardEntryPointerDown = (entry) => (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      source: { type: "sideboard", entry },
      dragging: false,
      overSlotId: null,
      overSideboard: false,
    };
  };

  useEffect(() => {
    const DRAG_THRESHOLD = 10;

    const readTarget = (x, y) => {
      const el = document.elementFromPoint(x, y);
      const slotEl = el?.closest("[data-slot-id]");
      const sideboardEl = el?.closest("[data-sideboard-dropzone]");
      return {
        slotId: slotEl ? Number(slotEl.dataset.slotId) : null,
        overSideboard: !!sideboardEl,
      };
    };

    const handlePointerMove = (e) => {
      const state = dragStateRef.current;
      if (!state.source) return;

      if (!state.dragging) {
        const dx = e.clientX - state.startX;
        const dy = e.clientY - state.startY;
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        state.dragging = true;
        if (state.source.type === "slot") setDraggedSlotId(state.source.id);
        else setDraggedSideboardEntryId(state.source.entry.id);
      }

      const { slotId, overSideboard } = readTarget(e.clientX, e.clientY);
      if (slotId !== state.overSlotId) {
        state.overSlotId = slotId;
        setDragOverSlotId(slotId);
      }
      if (overSideboard !== state.overSideboard) {
        state.overSideboard = overSideboard;
        setDragOverSideboard(overSideboard);
      }
    };

    const handlePointerUp = (e) => {
      const state = dragStateRef.current;
      if (state.dragging) {
        suppressClickRef.current = true;
        setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);

        const { slotId: finalSlotId, overSideboard: finalOverSideboard } = readTarget(
          e.clientX,
          e.clientY,
        );

        if (state.source.type === "slot") {
          if (finalSlotId && finalSlotId !== state.source.id) {
            swapSlots(state.source.id, finalSlotId);
          } else if (finalOverSideboard) {
            handleSendToSideboard(state.source.id);
          }
        } else if (state.source.type === "sideboard") {
          if (finalSlotId) {
            const targetSlot = pendingSlots.find((s) => s.id === finalSlotId);
            if (targetSlot && !targetSlot.cardId) {
              handlePlaceFromSideboard(finalSlotId, state.source.entry);
            }
          }
        }
      }
      dragStateRef.current = {
        startX: 0,
        startY: 0,
        source: null,
        dragging: false,
        overSlotId: null,
        overSideboard: false,
      };
      setDraggedSlotId(null);
      setDragOverSlotId(null);
      setDraggedSideboardEntryId(null);
      setDragOverSideboard(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [pendingSlots]);

  const goToDashboard = () => navigate("/");

  const handleSaveSlots = () => {
    setSlotsSaving(true);
    const slotUpdates = pendingSlots
      .filter((slot) => {
        const original = binderPage.binderPageCardSlots.find((s) => s.id === slot.id);
        return original.cardId !== slot.cardId;
      })
      .map((slot) => (slot.cardId ? attachCard(slot.id, slot.cardId) : removeCard(slot.id)));

    const sideboardAddCalls = pendingSideboardAdds.map((a) => addToSideboard(a.card.id, binderPage.id));
    const sideboardRemoveCalls = pendingSideboardRemovals.map((entryId) => removeFromSideboard(entryId));

    Promise.all([...slotUpdates, ...sideboardAddCalls, ...sideboardRemoveCalls]).then(() => {
      setSlotsSaving(false);
      loadBinderPage();
      loadSideboard();
      setPendingSideboardAdds([]);
      setPendingSideboardRemovals([]);
      setSlotsJustSaved(true);
      setTimeout(() => setSlotsJustSaved(false), 1500);
    });
  };

  const handleChangeLayout = (option) => {
    const newSlotCount = option.rows * option.columns;
    const displacedCards = pendingSlots.filter(
      (slot) => slot.position > newSlotCount && slot.cardId,
    ).length;

    if (newSlotCount < pendingSlots.length) {
      const message =
        displacedCards > 0
          ? `Switching to ${option.label} will move ${displacedCards} card${
              displacedCards === 1 ? "" : "s"
            } from the removed slots to your sideboard. Continue?`
          : `Switching to ${option.label} will remove ${
              pendingSlots.length - newSlotCount
            } empty slot(s). Continue?`;
      if (!window.confirm(message)) return;
    }

    setLayoutSaving(true);
    updateBinderPageLayout(binderPage.id, { rows: option.rows, columns: option.columns }).then(() => {
      setLayoutSaving(false);
      setChangingLayout(false);
      loadBinderPage();
      loadSideboard();
    });
  };

  const handleStartEdit = () => {
    setNewTitle(binderPage.title);
    setNewDescription(binderPage.description || "");
    setNewIsPublic(binderPage.isPublic);
    setEditing(true);
  };

  const handleExitEdit = () => {
    setNewTitle(binderPage.title);
    setNewDescription(binderPage.description || "");
    setNewIsPublic(binderPage.isPublic);
    setEditing(false);
  };

  const handleUpdateBinder = (e) => {
    e.preventDefault();
    setSaving(true);

    updateBinderPage(binderPage.id, {
      title: newTitle,
      description: newDescription,
      isPublic: newIsPublic,
    }).then(() => {
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
  const slotsDirty =
    pendingSlots.some((slot) => {
      const original = binderPage.binderPageCardSlots.find((s) => s.id === slot.id);
      return original.cardId !== slot.cardId;
    }) ||
    pendingSideboardAdds.length > 0 ||
    pendingSideboardRemovals.length > 0;

  return (
    <div className="relative mt-2 sm:mt-4">
      <button
        type="button"
        onClick={goToDashboard}
        className="inline-flex items-center gap-1 ml-4 mb-4 md:ml-0 md:mb-0 md:absolute md:top-0 md:left-4 px-3 py-1.5 rounded-lg border border-brand-periwinkle/40 text-sm font-semibold hover:bg-brand-blush/10"
      >
        <span aria-hidden="true">&larr;</span> Back to Dashboard
      </button>

      <div className="mx-auto px-4 max-w-2xl lg:max-w-none lg:w-fit">
      <div className="lg:flex lg:items-start lg:gap-4">
      <div className="lg:shrink-0">
      <div
        className="bg-white/5 rounded-2xl p-3 sm:p-4 mb-3 mx-auto lg:mx-0"
        style={{ width: "clamp(240px, calc((100vh - 260px) / 1.35), 38rem)" }}
      >
        <div className="relative min-w-0 border border-brand-periwinkle/30 rounded-xl p-2 sm:p-3">
          {editing ? (
              <form onSubmit={handleUpdateBinder} className="flex flex-col gap-2">
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="font-heading text-xl font-bold border border-brand-periwinkle/40 rounded px-2 py-1 bg-white text-brand-ink focus:outline-none focus:border-brand-rose"
                  autoFocus
                />
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Add a description or notes..."
                  rows={3}
                  className="text-sm border border-brand-periwinkle/40 rounded px-2 py-1 bg-white text-brand-ink focus:outline-none focus:border-brand-rose resize-none w-full"
                />
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsPublic}
                    onChange={(e) => setNewIsPublic(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span>Public (visible on your profile, no login required)</span>
                </label>
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
                <span
                  className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                    binderPage.isPublic
                      ? "bg-brand-sky/20 text-brand-sky"
                      : "bg-white/10 text-brand-cream/50"
                  }`}
                >
                  {binderPage.isPublic ? "Public" : "Private"}
                </span>
              </>
            )}
          </div>
      </div>

      <div
        className="bg-white/5 rounded-2xl p-4 sm:p-6 mx-auto lg:mx-0"
        style={{ width: "clamp(240px, calc((100vh - 260px) / 1.35), 38rem)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-brand-cream/60">
            Layout: {binderPage.rows} × {binderPage.columns}
          </span>
          {changingLayout ? (
            <div className="flex flex-wrap gap-1 justify-end">
              {LAYOUTS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  disabled={layoutSaving}
                  onClick={() => handleChangeLayout(option)}
                  className={`px-2 py-1 rounded border text-xs font-semibold disabled:opacity-50 ${
                    binderPage.rows === option.rows && binderPage.columns === option.columns
                      ? "border-brand-rose bg-brand-rose/20"
                      : "border-brand-periwinkle/40 hover:bg-brand-blush/10"
                  }`}
                >
                  {option.rows}×{option.columns}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setChangingLayout(false)}
                className="px-2 py-1 rounded border border-brand-periwinkle/40 text-xs hover:bg-brand-blush/10"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={slotsDirty}
              onClick={() => setChangingLayout(true)}
              title={slotsDirty ? "Save or cancel your card changes first" : undefined}
              className="text-xs underline decoration-brand-periwinkle/50 hover:text-brand-sky disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
            >
              Change Layout
            </button>
          )}
        </div>
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${binderPage.columns}, minmax(0, 1fr))` }}
        >
          {sortedSlots.map((slot) => (
            <CardSlot
              key={slot.id}
              slot={slot}
              onSelect={() => handleSelectSlot(slot.id)}
              onRemove={() => handleRemoveCard(slot.id)}
              onSendToSideboard={() => handleSendToSideboard(slot.id)}
              onPointerDown={slot.card ? handleSlotPointerDown(slot.id) : undefined}
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

      <div
        data-sideboard-dropzone
        className={`bg-white/5 rounded-2xl p-4 sm:p-6 mx-auto mt-3 lg:mt-0 lg:w-52 lg:shrink-0 flex flex-col transition-colors ${
          dragOverSideboard ? "ring-2 ring-brand-rose bg-brand-blush/10" : ""
        }`}
        style={{
          maxWidth: "clamp(240px, calc((100vh - 260px) / 1.35), 38rem)",
          height: "clamp(200px, calc((100vh - 260px) / 1.1), 28rem)",
        }}
      >
        <h2 className="font-heading text-sm font-bold mb-2 shrink-0">Sideboard</h2>
        {selectedSideboardEntryId && (
          <p className="text-xs text-brand-sky mb-2 shrink-0">
            Card selected — tap an empty slot to place it, or drag any card directly.
          </p>
        )}
        <div className="flex-1 min-h-0">
          <Sideboard
            entries={sideboardEntries}
            selectedEntryId={selectedSideboardEntryId}
            onSelectEntry={(entryId) =>
              setSelectedSideboardEntryId((current) => (current === entryId ? null : entryId))
            }
            onDiscardEntry={handleDiscardSideboardEntry}
            onEntryPointerDown={handleSideboardEntryPointerDown}
            draggedEntryId={draggedSideboardEntryId}
          />
        </div>
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
