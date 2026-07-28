function handleActivateKey(onSelect) {
  return (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };
}

export default function CardSlot({ slot, onSelect, onRemove }) {
  if (slot.card) {
    return (
      <div
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={handleActivateKey(onSelect)}
        aria-label={`${slot.card.name}, slot ${slot.position}. Press Enter to change card.`}
      >
        <div className="relative aspect-[5/7] border border-brand-periwinkle/30 rounded overflow-hidden hover:bg-brand-blush/20 focus-visible:ring-2 focus-visible:ring-brand-rose">
          <img
            src={slot.card.imageUrl}
            alt={slot.card.name}
            className="w-full h-full object-contain"
          />
          <button
            className="absolute top-0 right-0 w-7 h-7 rounded-bl-lg bg-black/40 hover:bg-black/60 border-l border-b border-white/30 opacity-70 hover:opacity-100 flex items-center justify-center transition-colors"
            aria-label={`Remove ${slot.card.name} from slot`}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 -translate-y-px translate-x-px"
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
        <p className="text-sm text-center mt-1">{slot.card.name}</p>
      </div>
    );
  }

  return (
    <div
      className="aspect-[5/7] border-2 border-dashed border-brand-periwinkle/40 rounded flex items-center justify-center cursor-pointer hover:bg-brand-blush/20 text-brand-periwinkle focus-visible:ring-2 focus-visible:ring-brand-rose"
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleActivateKey(onSelect)}
      aria-label={`Empty slot ${slot.position}. Press Enter to add a card.`}
    >
      <span aria-hidden="true">+</span>
    </div>
  );
}
