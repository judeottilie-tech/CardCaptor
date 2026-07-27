import { useEffect, useState } from "react";
import { getCards } from "../../managers/cardManager";

const PAGE_SIZE = 60;

export default function CardPicker({ onPick, onClose }) {
  const [cards, setCards] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    getCards({ page, pageSize: PAGE_SIZE, search }, controller.signal)
      .then(({ cards, totalCount }) => {
        setCards(cards);
        setTotalCount(totalCount);
      })
      .catch((err) => {
        if (err.name !== "AbortError") throw err;
      });
    return () => controller.abort();
  }, [page, search]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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

        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search cards..."
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {cards.map((card) => (
            <img
              key={card.id}
              src={card.imageUrl}
              alt={card.name}
              onClick={() => setSelectedCard(card)}
              className={`cursor-pointer hover:opacity-75 ${
                selectedCard?.id === card.id ? "ring-4 ring-blue-500" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {selectedCard && (
        <div
          className="fixed bottom-4 right-4 bg-white border rounded p-3 shadow-lg flex flex-col items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={selectedCard.imageUrl}
            alt={selectedCard.name}
            className="w-40"
          />
          <p className="text-sm font-semibold">{selectedCard.name}</p>
          <button
            onClick={() => onPick(selectedCard)}
            className="px-4 py-1 bg-blue-600 text-white rounded"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
