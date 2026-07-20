import { useEffect, useState } from "react";
import { getCards } from "../../managers/cardManager";

export default function CardPicker({ onPick, onClose }) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    getCards().then(setCards) 
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-4 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Choose a Card</h3>
          <button onClick={onClose}>x</button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {cards.map((card) => (
            <img
              key={card.id}
              src={card.imageUrl}
              alt={card.name}
              onClick={() => onPick(card.id)}
              className="cursor-pointer hover:opacity-75"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
