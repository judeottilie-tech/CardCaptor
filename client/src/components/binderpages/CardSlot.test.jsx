import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardSlot from "./CardSlot";

const emptySlot = { id: 1, position: 1, card: null, cardId: null };
const filledSlot = {
  id: 2,
  position: 2,
  cardId: 99,
  card: { id: 99, name: "Pikachu", imageUrl: "https://example.com/pikachu.png" },
};

describe("CardSlot", () => {
  it("empty slot calls onSelect when clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(<CardSlot slot={emptySlot} onSelect={onSelect} onRemove={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /Empty slot 1/i }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("empty slot calls onSelect on Enter key (keyboard-operable)", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(<CardSlot slot={emptySlot} onSelect={onSelect} onRemove={vi.fn()} />);

    const slot = screen.getByRole("button", { name: /Empty slot 1/i });
    slot.focus();
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("filled slot renders the card image and a remove button", () => {
    render(<CardSlot slot={filledSlot} onSelect={vi.fn()} onRemove={vi.fn()} />);

    expect(screen.getByAltText("Pikachu")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Remove Pikachu from slot/i })).toBeInTheDocument();
  });

  it("clicking the remove button calls onRemove but NOT onSelect (stopPropagation)", async () => {
    const onSelect = vi.fn();
    const onRemove = vi.fn();
    const user = userEvent.setup();

    render(<CardSlot slot={filledSlot} onSelect={onSelect} onRemove={onRemove} />);

    await user.click(screen.getByRole("button", { name: /Remove Pikachu from slot/i }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("clicking the card itself (not the remove button) calls onSelect", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(<CardSlot slot={filledSlot} onSelect={onSelect} onRemove={vi.fn()} />);

    await user.click(screen.getByAltText("Pikachu"));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
