import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBinderPageById,
  updateBinderPage,
  deleteBinderPage,
} from "../../managers/binderPageManager";
import { attachCard, removeCard } from "../../managers/binderPageCardSlotManager";
import CardSlot from "./CardSlot";
import CardPicker from "./CardPicker";

export default function BinderPageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [binderPage, setBinderPage] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  const loadBinderPage = () => {
    getBinderPageById(id).then((bp) => {
      setBinderPage(bp);
      setNewTitle(bp.title);
    });
  };

  useEffect(() => {
    loadBinderPage()
  }, [id]);

  const handleSelectSlot = (slotId) => {
    setSelectedSlotId(slotId);
  };
  
  const handleClosePicker = () => {
    setSelectedSlotId(null);
  };  

  const handlePickCard = (cardId) => {
    attachCard(selectedSlotId, cardId).then(() => {
      loadBinderPage();
      setSelectedSlotId(null);
    });
  };

  const handleRemoveCard = (slotId) => {
    removeCard(slotId).then(loadBinderPage)
  };

  const handleDeleteBinder = () => {
    if (!window.confirm(`Delete "${binderPage.title}"? This can't be undone.`)) return;
    deleteBinderPage(binderPage.id).then(() => navigate("/"));
  };

  const handleUpdateBinder = (e) => {
    e.preventDefault();
    updateBinderPage(binderPage.id, { title: newTitle }).then(() => {
      loadBinderPage();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    });
  };


  if (!binderPage) return <p>Loading...</p>;

  const sortedSlots = [...binderPage.binderPageCardSlots].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <form onSubmit={handleUpdateBinder} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="text-xl font-bold border rounded px-2 py-1 flex-1 min-w-0"
        />
        <div className="flex items-center gap-2">
          <button type="submit" className="flex-1 sm:flex-none px-3 py-1 rounded bg-blue-500 text-white">
            Save
          </button>
          <button
            type="button"
            onClick={handleDeleteBinder}
            className="flex-1 sm:flex-none px-3 py-1 rounded bg-red-500 text-white"
          >
            Delete
          </button>
          {justSaved && <span className="text-green-600 text-sm">Saved</span>}
        </div>
      </form>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {sortedSlots.map((slot) => (
          <CardSlot
            key={slot.id}
            slot={slot}
            onSelect={() => handleSelectSlot(slot.id)}
            onRemove={() => handleRemoveCard(slot.id)}
          />
        ))}
      </div>

      {selectedSlotId && (
        <CardPicker onPick={handlePickCard} onClose={handleClosePicker} />
      )}
    </div>
  );
}
