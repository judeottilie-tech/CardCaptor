using System.ComponentModel.DataAnnotations;
namespace CardCaptor.Models.DTOs;

public class RegistrationDTO
{
    public string UserName { get; set; }
    public string Password { get; set; }
    public string DisplayName { get; set; }
    public string StarterPokemon { get; set; }
};