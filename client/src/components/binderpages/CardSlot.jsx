function handleActivateKey(onSelect) {
  return (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };
}

export default function CardSlot({
  slot,
  onSelect,
  onRemove,
  onPointerDown,
  isDragging,
  isDragOver,
}) {
  if (slot.card) {
    return (
      <div
        className={`relative aspect-[5/7] cursor-grab active:cursor-grabbing border rounded overflow-hidden hover:bg-brand-blush/20 focus-visible:ring-2 focus-visible:ring-brand-rose transition-opacity ${
          isDragOver
            ? "border-2 border-brand-rose bg-brand-blush/30"
            : "border-brand-periwinkle/30"
        } ${isDragging ? "opacity-40" : ""}`}
        style={{ touchAction: "none" }}
        role="button"
        tabIndex={0}
        data-slot-id={slot.id}
        onPointerDown={onPointerDown}
        onClick={onSelect}
        onKeyDown={handleActivateKey(onSelect)}
        aria-label={`${slot.card.name}, slot ${slot.position}. Press Enter to change card, or drag to move it to another slot.`}
      >
        <img
          src={slot.card.imageUrl}
          alt={slot.card.name}
          draggable={false}
          className="w-full h-full object-contain"
          style={{ WebkitUserDrag: "none" }}
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
    );
  }

  return (
    <div
      className={`aspect-[5/7] border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-brand-blush/20 text-brand-periwinkle focus-visible:ring-2 focus-visible:ring-brand-rose ${
        isDragOver ? "border-brand-rose bg-brand-blush/30" : "border-brand-periwinkle/40"
      }`}
      role="button"
      tabIndex={0}
      data-slot-id={slot.id}
      onClick={onSelect}
      onKeyDown={handleActivateKey(onSelect)}
      aria-label={`Empty slot ${slot.position}. Press Enter to add a card, or drop a card here to move it.`}
    >
      <span aria-hidden="true">+</span>
    </div>
  );
}
