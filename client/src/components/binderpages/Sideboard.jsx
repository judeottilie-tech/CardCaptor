export default function Sideboard({ entries, selectedEntryId, onSelectEntry, onDiscardEntry }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-brand-cream/50 text-center py-2">
        Your sideboard is empty. Send a card here from a filled slot to set it aside.
      </p>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={`relative shrink-0 w-16 aspect-[5/7] cursor-pointer border rounded overflow-hidden hover:bg-brand-blush/20 focus-visible:ring-2 focus-visible:ring-brand-rose transition-colors ${
            selectedEntryId === entry.id
              ? "border-2 border-brand-rose bg-brand-blush/30"
              : "border-brand-periwinkle/30"
          }`}
          role="button"
          tabIndex={0}
          onClick={() => onSelectEntry(entry.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectEntry(entry.id);
            }
          }}
          aria-label={`${entry.card.name} in sideboard. Press Enter to select, then choose an empty slot to place it.`}
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
