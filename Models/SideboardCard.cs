namespace CardCaptor.Models;

public class SideboardCard
{
    public int Id { get; set; }
    public int UserProfileId { get; set; }
    public UserProfile UserProfile { get; set; }
    public int CardId { get; set; }
    public Card Card { get; set; }
    public DateTime AddedAt { get; set; }
};
