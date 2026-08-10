namespace CardCaptor.Models;

public class BinderPageLike
{
    public int Id { get; set; }
    public int BinderPageId { get; set; }
    public BinderPage BinderPage { get; set; }
    public int UserProfileId { get; set; }
    public UserProfile UserProfile { get; set; }
    public DateTime CreatedAt { get; set; }
};
