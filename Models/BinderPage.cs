namespace CardCaptor.Models;

public class BinderPage
{
    public int Id { get; set; }
    public string Title { get; set; }
    public int UserProfileId { get; set; }
    public DateTime CreatedAt { get; set; }
    public UserProfile UserProfile { get; set; }

    public List<BinderPageCardSlot> BinderPageCardSlots { get; set; }

};