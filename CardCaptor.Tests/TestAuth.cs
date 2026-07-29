using System.Net.Http.Json;
using System.Text;
using Microsoft.AspNetCore.Mvc.Testing;

namespace CardCaptor.Tests;

public static class TestAuth
{
    public static string EncodePassword(string password) =>
        Convert.ToBase64String(Encoding.GetEncoding("iso-8859-1").GetBytes(password));

    // Outside Development, the auth cookie is issued with SecurePolicy.Always
    // (needed for the real cross-origin Vercel+Render deploy), which means it
    // only gets attached to HTTPS requests. WebApplicationFactory's default
    // client base address is plain http://, so the cookie would silently get
    // dropped between requests unless the client is HTTPS from the start.
    public static HttpClient NewClient(WebApplicationFactory<Program> factory) =>
        factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
        });

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
        var client = NewClient(factory);

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
