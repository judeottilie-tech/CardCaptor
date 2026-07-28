import { useEffect, useState } from "react";
import { getCards } from "../../managers/cardManager";

// Keep at/below the ~20-request burst that assets.tcgdex.net can reliably
// serve at once — going higher (tried 24) caused widespread image failures.
// Sized per breakpoint so the grid is a clean, complete rectangle that fits
// the modal without scrolling: 3 cols x 3 rows on mobile, 4 cols x 3 rows
// on sm+ (matches Tailwind's `sm` breakpoint, used for grid-cols below).
const MOBILE_PAGE_SIZE = 9;
const DESKTOP_PAGE_SIZE = 12;
const DESKTOP_BREAKPOINT = "(min-width: 640px)";

function getPageItems(current, total, siblingCount = 1) {
  if (total <= 1) return [1];
  const items = new Set([1, total, current]);
  for (let i = 1; i <= siblingCount; i++) {
    if (current - i >= 1) items.add(current - i);
    if (current + i <= total) items.add(current + i);
  }
  const sorted = [...items].sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  for (const n of sorted) {
    if (prev && n - prev > 1) result.push("ellipsis");
    result.push(n);
    prev = n;
  }
  return result;
}

export default function CardPicker({ onPick, onClose, currentCard }) {
  const [cards, setCards] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(currentCard || null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadedIds, setLoadedIds] = useState(new Set());
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(DESKTOP_BREAKPOINT).matches,
  );
  const pageSize = isDesktop ? DESKTOP_PAGE_SIZE : MOBILE_PAGE_SIZE;

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_BREAKPOINT);
    const handleChange = (e) => {
      setIsDesktop(e.matches);
      setPage(1);
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

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
    getCards({ page, pageSize, search, category }, controller.signal)
      .then(({ cards, totalCount }) => {
        setCards(cards);
        setTotalCount(totalCount);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setLoading(false);
          throw err;
        }
      });
    return () => controller.abort();
  }, [page, pageSize, search, category]);

  const totalPages = Math.ceil(totalCount / pageSize);
  const pageItems = getPageItems(page, totalPages);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white text-brand-ink rounded p-4 w-full max-w-3xl max-h-[95vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Choose a Card</h3>
          <button onClick={onClose} aria-label="Close card picker" className="text-xl leading-none px-1">
            <span aria-hidden="true">x</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <label htmlFor="card-search" className="sr-only">
            Search cards
          </label>
          <input
            id="card-search"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search cards..."
            className="flex-1 min-w-0 border border-brand-periwinkle/40 rounded px-3 py-2 bg-white text-brand-ink focus:outline-none focus:border-brand-rose"
          />
          <label htmlFor="card-category" className="sr-only">
            Filter by category
          </label>
          <select
            id="card-category"
            value={category}
            onChange={handleCategoryChange}
            className="border border-brand-periwinkle/40 rounded px-3 py-2 bg-white text-brand-ink focus:outline-none focus:border-brand-rose"
          >
            <option value="">All categories</option>
            <option value="Pokemon">Pokemon</option>
            <option value="Trainer">Trainer</option>
            <option value="Energy">Energy</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          {/* Preview frame — desktop/tablet only. On mobile there's no room
              for it, so selecting a card just rings its thumbnail and lights
              up Confirm in the bar below. */}
          <div className="hidden sm:flex sm:order-2 w-full sm:w-64 shrink-0 flex-col items-center gap-2 border-2 border-dashed border-brand-periwinkle/40 rounded-lg p-3">
            <div className="w-full aspect-[5/7] rounded overflow-hidden bg-brand-blush/10 flex items-center justify-center">
              {selectedCard ? (
                <img
                  src={selectedCard.imageUrl}
                  alt={selectedCard.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-sm text-brand-ink/40 text-center px-2">
                  No card selected
                </span>
              )}
            </div>
            <p className="w-full font-heading font-bold text-lg text-center">
              {selectedCard ? selectedCard.name : " "}
            </p>
          </div>

          <div className="sm:order-1 flex-1 min-w-0 w-full">
            {loading ? (
              <p className="text-center py-8 text-brand-ink/60">Loading...</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-[55vh] sm:max-h-none overflow-y-auto sm:overflow-visible -mx-1 px-1 py-1">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className={`relative aspect-[5/7] rounded ring-offset-2 ${
                      selectedCard?.id === card.id ? "ring-2 ring-brand-rose" : ""
                    }`}
                    onClick={() => setSelectedCard(card)}
                    aria-label={`Select ${card.name}`}
                    aria-pressed={selectedCard?.id === card.id}
                  >
                    {!loadedIds.has(card.id) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-brand-blush/25 rounded">
                        <span className="animate-spin h-4 w-4 border-2 border-brand-periwinkle/50 border-t-transparent rounded-full" />
                      </div>
                    )}
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      onLoad={() => setLoadedIds((prev) => new Set(prev).add(card.id))}
                      className="w-full h-full object-contain rounded cursor-pointer hover:opacity-75"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 mt-4">
          <div className="flex items-center justify-center flex-wrap gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border border-brand-periwinkle/40 rounded disabled:opacity-40 text-sm"
            >
              Prev
            </button>

            <div className="flex items-center gap-1">
              {pageItems.map((item, i) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-brand-ink/50 text-sm">
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    aria-current={item === page ? "page" : undefined}
                    className={`w-8 h-8 rounded text-sm ${
                      item === page
                        ? "bg-brand-rose text-brand-ink font-semibold"
                        : "border border-brand-periwinkle/40 hover:bg-brand-blush/20"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border border-brand-periwinkle/40 rounded disabled:opacity-40 text-sm"
            >
              Next
            </button>
          </div>

          <button
            type="button"
            disabled={!selectedCard}
            onClick={() => selectedCard && onPick(selectedCard)}
            className={`self-end sm:self-auto px-4 py-1.5 rounded font-semibold text-sm transition-colors ${
              selectedCard
                ? "bg-brand-rose text-brand-ink"
                : "bg-black/10 text-brand-ink/30 cursor-not-allowed"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
