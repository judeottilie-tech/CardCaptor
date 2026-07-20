import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBinderPageById } from "../../managers/binderPageManager";
import { attachCard, removeCard } from "../../managers/binderPageCardSlotManager";
import CardSlot from "./CardSlot";
import CardPicker from "./CardPicker";

export default function BinderPageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [binderPage, setBinderPage] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const loadBinderPage = () => {
    getBinderPageById(id).then(setBinderPage)
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

  if (!binderPage) return <p>Loading...</p>;

  const sortedSlots = [...binderPage.binderPageCardSlots].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <h2 className="text-xl font-bold mb-4">{binderPage.title}</h2>

      <div className="grid grid-cols-3 gap-4">
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
