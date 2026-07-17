using Microsoft.AspNetCore.Identity;

namespace CardCaptor.Models;

public class UserProfile
{
    public int Id { get; set; }
    public string DisplayName { get; set; }
    public string IdentityUserId { get; set; }
    public IdentityUser IdentityUser { get; set; }

    public List<BinderPage> BinderPages { get; set; }
    
};