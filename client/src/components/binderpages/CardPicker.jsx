import { useEffect, useState } from "react";
import { getCards } from "../../managers/cardManager";

const PAGE_SIZE = 20;

export default function CardPicker({ onPick, onClose }) {
  const [cards, setCards] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadedIds, setLoadedIds] = useState(new Set());

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getCards({ page, pageSize: PAGE_SIZE, search, category }, controller.signal)
      .then(({ cards, totalCount }) => {
        setCards(cards);
        setTotalCount(totalCount);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") 
          {
            setLoading(false);
            throw err;
          }
      });
    return () => controller.abort();
  }, [page, search, category]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

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

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search cards..."
            className="flex-1 border rounded px-3 py-2"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="border rounded px-3 py-2"
          >
            <option value="">All categories</option>
            <option value="Pokemon">Pokemon</option>
            <option value="Trainer">Trainer</option>
            <option value="Energy">Energy</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center py-8 text-slate-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {cards.map((card) => (
              <div key={card.id} className="relative">
                {!loadedIds.has(card.id) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded">
                    <span className="animate-spin h-5 w-5 border-2 border-slate-400 border-t-transparent rounded-full" />
                  </div>
                )}
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  onLoad={() =>
                    setLoadedIds((prev) => new Set(prev).add(card.id))
                  }
                  onClick={() => setSelectedCard(card)}
                  className={`cursor-pointer hover:opacity-75 ${
                    selectedCard?.id === card.id ? "ring-4 ring-blue-500" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <div className="flex flex-wrap gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-2 py-1 border rounded ${
                    pageNumber === page ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  {pageNumber}
                </button>
              ),
            )}
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
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
