namespace CardCaptor.Models;

public class SideboardCard
{
    public int Id { get; set; }
    public int BinderPageId { get; set; }
    public BinderPage BinderPage { get; set; }
    public int CardId { get; set; }
    public Card Card { get; set; }
    public DateTime AddedAt { get; set; }
};
