using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace CardCaptor.Tests;

public class AuthControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly WebApplicationFactory<Program> _factory;

    public AuthControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Register_WithValidData_SignsUserInAndCreatesProfile()
    {
        var client = await TestAuth.RegisterAndLoginAsync(_factory, displayName: "Ash Ketchum");

        var me = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.OK, me.StatusCode);
        var profile = await me.Content.ReadFromJsonAsync<UserProfileResponse>(TestJson.Options);
        Assert.Equal("Ash Ketchum", profile!.DisplayName);
    }

    [Fact]
    public async Task Register_WithInvalidStarter_ReturnsBadRequest()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/register", new
        {
            userName = $"user-{Guid.NewGuid():N}",
            password = TestAuth.EncodePassword("password123"),
            displayName = "Bad Starter",
            starterPokemon = "NotARealPokemon",
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Register_WithMalformedBase64Password_ReturnsBadRequestNotServerError()
    {
        // Regression test: Register() used to have no try/catch around the
        // base64 decode, unlike Login(), so a malformed password crashed
        // with an unhandled FormatException instead of a controlled response.
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/register", new
        {
            userName = $"user-{Guid.NewGuid():N}",
            password = "not-valid-base64!!!",
            displayName = "Bad Password",
            starterPokemon = "Bulbasaur",
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithCorrectCredentials_Succeeds()
    {
        var username = $"user-{Guid.NewGuid():N}";
        await TestAuth.RegisterAndLoginAsync(_factory, username: username, password: "correct-password");

        var client = _factory.CreateClient();
        var response = await client.SendAsync(LoginRequest(username, "correct-password"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithWrongPassword_ReturnsUnauthorized()
    {
        var username = $"user-{Guid.NewGuid():N}";
        await TestAuth.RegisterAndLoginAsync(_factory, username: username, password: "correct-password");

        var client = _factory.CreateClient();
        var response = await client.SendAsync(LoginRequest(username, "wrong-password"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Me_WhenNotLoggedIn_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private static HttpRequestMessage LoginRequest(string username, string password)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/auth/login");
        var encodedCreds = Convert.ToBase64String(
            System.Text.Encoding.GetEncoding("iso-8859-1").GetBytes($"{username}:{password}"));
        request.Headers.Add("Authorization", $"Basic {encodedCreds}");
        return request;
    }

    private record UserProfileResponse(int Id, string DisplayName, string UserName, string IdentityUserId);
}
