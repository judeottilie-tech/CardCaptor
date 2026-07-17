using System.ComponentModel.DataAnnotations;
namespace CardCaptor.Models.DTOs;

public class UserProfileDTO
{
    public int Id { get; set; }
    public string DisplayName { get; set; }
    public string UserName { get; set; }
    public string IdentityUserId { get; set; }
};