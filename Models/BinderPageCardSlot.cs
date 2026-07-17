using Microsoft.AspNetCore.Identity;

namespace CardCaptor.Models;

public class BinderPageCardSlot
{
    public int Id { get; set; }
    public int Position { get; set; }
    public int BinderPageId { get; set; }
    public BinderPage BinderPage { get; set; }
    public int? CardId { get; set; }
    public Card? Card { get; set; }
};