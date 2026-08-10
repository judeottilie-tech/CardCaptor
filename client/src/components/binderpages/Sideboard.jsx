export default function Sideboard({
  entries,
  selectedEntryId,
  onSelectEntry,
  onDiscardEntry,
  onEntryPointerDown,
  draggedEntryId,
}) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-brand-cream/50 text-center py-2 h-full flex items-center justify-center">
        Your sideboard is empty. Drag a card here from a filled slot to set it aside.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-3 gap-1.5 content-start h-full overflow-hidden">
      {entries.map((entry) => (
        <div
          key={entry.id}
          data-sideboard-id={entry.id}
          className={`relative min-w-0 min-h-0 aspect-[5/7] cursor-grab active:cursor-grabbing border rounded overflow-hidden hover:bg-brand-blush/20 focus-visible:ring-2 focus-visible:ring-brand-rose transition-opacity ${
            selectedEntryId === entry.id
              ? "border-2 border-brand-rose bg-brand-blush/30"
              : "border-brand-periwinkle/30"
          } ${draggedEntryId === entry.id ? "opacity-40" : ""}`}
          style={{ touchAction: "none" }}
          role="button"
          tabIndex={0}
          onPointerDown={onEntryPointerDown(entry)}
          onClick={() => onSelectEntry(entry.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectEntry(entry.id);
            }
          }}
          aria-label={`${entry.card.name} in sideboard. Press Enter to select, then choose an empty slot to place it, or drag it onto a slot.`}
        >
          <img
            src={entry.card.imageUrl}
            alt={entry.card.name}
            draggable={false}
            className="w-full h-full object-contain"
            style={{ WebkitUserDrag: "none" }}
          />
          <button
            className="absolute top-0 right-0 w-5 h-5 rounded-bl-lg bg-black/40 hover:bg-black/60 border-l border-b border-white/30 opacity-70 hover:opacity-100 flex items-center justify-center transition-colors"
            aria-label={`Discard ${entry.card.name} from sideboard`}
            onClick={(e) => {
              e.stopPropagation();
              onDiscardEntry(entry);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-2.5 h-2.5"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
