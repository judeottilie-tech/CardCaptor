using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace CardCaptor.Tests;

public class CardControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly WebApplicationFactory<Program> _factory;

    public CardControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Get_WithZeroPage_DoesNotThrowAndBehavesLikePageOne()
    {
        // Regression test: page <= 0 used to reach an unclamped Skip() with
        // a negative count, which EF Core throws on instead of returning data.
        var client = await TestAuth.RegisterAndLoginAsync(_factory);

        var zeroPage = await client.GetFromJsonAsync<CardPageResponse>("/api/card?page=0&pageSize=10", TestJson.Options);
        var pageOne = await client.GetFromJsonAsync<CardPageResponse>("/api/card?page=1&pageSize=10", TestJson.Options);

        Assert.Equal(pageOne!.Cards.Select(c => c.Id), zeroPage!.Cards.Select(c => c.Id));
    }

    [Fact]
    public async Task Get_WithNegativePage_DoesNotThrow()
    {
        var client = await TestAuth.RegisterAndLoginAsync(_factory);

        var response = await client.GetAsync("/api/card?page=-5&pageSize=10");

        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task Get_WithHugePageSize_IsClampedToOneHundred()
    {
        // Regression test: the whole point of pagination was to stop the
        // frontend from bursting hundreds of simultaneous image requests, so
        // pageSize must have a real ceiling regardless of what a client asks for.
        var client = await TestAuth.RegisterAndLoginAsync(_factory);

        var response = await client.GetFromJsonAsync<CardPageResponse>("/api/card?pageSize=10000", TestJson.Options);

        Assert.True(response!.Cards.Count <= 100);
    }

    [Fact]
    public async Task Get_FiltersByCategory()
    {
        var client = await TestAuth.RegisterAndLoginAsync(_factory);

        var response = await client.GetFromJsonAsync<CardPageResponse>("/api/card?category=Energy&pageSize=100", TestJson.Options);

        Assert.NotEmpty(response!.Cards);
        Assert.All(response.Cards, c => Assert.Equal("Energy", c.Category));
    }

    [Fact]
    public async Task Get_FiltersByRarityAndEra()
    {
        var client = await TestAuth.RegisterAndLoginAsync(_factory);

        var response = await client.GetFromJsonAsync<CardPageResponse>(
            "/api/card?rarity=Rare&era=Classic&pageSize=100", TestJson.Options);

        Assert.NotEmpty(response!.Cards);
        Assert.All(response.Cards, c =>
        {
            Assert.Equal("Rare", c.Rarity);
            Assert.Equal("Classic", c.Era);
        });
    }

    [Fact]
    public async Task Get_WhenNotAuthenticated_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/card");

        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private record CardPageResponse(int TotalCount, List<CardResponse> Cards);

    private record CardResponse(int Id, string Name, string Category, string Rarity, string Era);
}
