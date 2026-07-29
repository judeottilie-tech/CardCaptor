using System.Net.Http.Json;
using System.Text;
using Microsoft.AspNetCore.Mvc.Testing;

namespace CardCaptor.Tests;

public static class TestAuth
{
    public static string EncodePassword(string password) =>
        Convert.ToBase64String(Encoding.GetEncoding("iso-8859-1").GetBytes(password));

    // Registers a fresh user (unique username per call) and returns an
    // HttpClient that's already cookie-authenticated as that user, since
    // Register() signs the caller in on success.
    public static async Task<HttpClient> RegisterAndLoginAsync(
        WebApplicationFactory<Program> factory,
        string? username = null,
        string password = "password123",
        string displayName = "Test User",
        string starterPokemon = "Bulbasaur")
    {
        username ??= $"user-{Guid.NewGuid():N}";
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/register", new
        {
            userName = username,
            password = EncodePassword(password),
            displayName,
            starterPokemon,
        });
        response.EnsureSuccessStatusCode();

        return client;
    }
}
