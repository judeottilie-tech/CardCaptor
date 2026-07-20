export default function CardSlot({ slot, onSelect, onRemove }) {
  if (slot.card) {
    return (
      <div
        className="relative border rounded p-2 cursor-pointer hover:bg-slate-50"
        onClick={onSelect}
      >
        <img src={slot.card.imageUrl} alt={slot.card.name} className="w-full" />
        <p className="text-sm text-center mt-1">{slot.card.name}</p>

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
    );
  }

  return (
    <div
      className="border-2 border-dashed border-slate-300 rounded flex items-center justify-center h-32 cursor-pointer hover:bg-slate-50"
      onClick={onSelect}
    >
      +
    </div>
  );
}
