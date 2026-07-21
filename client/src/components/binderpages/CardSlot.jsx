export default function CardSlot({ slot, onSelect, onRemove }) {
  if (slot.card) {
    return (
      <div className="cursor-pointer" onClick={onSelect}>
        <div className="relative aspect-[5/7] border rounded overflow-hidden hover:bg-slate-50">
          <img
            src={slot.card.imageUrl}
            alt={slot.card.name}
            className="w-full h-full object-contain"
          />
          <button
            className="absolute top-1 right-1 w-8 h-8 rounded-full bg-white border text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            x
          </button>
        </div>
        <p className="text-sm text-center mt-1">{slot.card.name}</p>
      </div>
    );
  }

  return (
    <div
      className="aspect-[5/7] border-2 border-dashed border-slate-300 rounded flex items-center justify-center cursor-pointer hover:bg-slate-50"
      onClick={onSelect}
    >
      +
    </div>
  );
}
