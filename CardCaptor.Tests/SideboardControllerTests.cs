using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace CardCaptor.Tests;

public class SideboardControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly WebApplicationFactory<Program> _factory;

    public SideboardControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Get_WhenEmpty_ReturnsEmptyList()
    {
        var user = await TestAuth.RegisterAndLoginAsync(_factory);

        var sideboard = await user.GetFromJsonAsync<List<SideboardCardResponse>>("/api/sideboard", TestJson.Options);

        Assert.Empty(sideboard!);
    }

    [Fact]
    public async Task Create_AddsCardToCallersSideboard()
    {
        var user = await TestAuth.RegisterAndLoginAsync(_factory);
        var cardId = await AnyCardId(user);

        var response = await user.PostAsJsonAsync("/api/sideboard", new { cardId });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var sideboard = await user.GetFromJsonAsync<List<SideboardCardResponse>>("/api/sideboard", TestJson.Options);
        Assert.Single(sideboard!);
        Assert.Equal(cardId, sideboard![0].CardId);
    }

    [Fact]
    public async Task Get_OnlyReturnsCallersOwnEntries()
    {
        var owner = await TestAuth.RegisterAndLoginAsync(_factory);
        var otherUser = await TestAuth.RegisterAndLoginAsync(_factory);
        var cardId = await AnyCardId(owner);
        await owner.PostAsJsonAsync("/api/sideboard", new { cardId });

        var otherSideboard = await otherUser.GetFromJsonAsync<List<SideboardCardResponse>>("/api/sideboard", TestJson.Options);

        Assert.Empty(otherSideboard!);
    }

    [Fact]
    public async Task Delete_WhenOwner_RemovesEntry()
    {
        var user = await TestAuth.RegisterAndLoginAsync(_factory);
        var cardId = await AnyCardId(user);
        var created = await user.PostAsJsonAsync("/api/sideboard", new { cardId });
        var entry = (await created.Content.ReadFromJsonAsync<SideboardCardResponse>(TestJson.Options))!;

        var response = await user.DeleteAsync($"/api/sideboard/{entry.Id}");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        var sideboard = await user.GetFromJsonAsync<List<SideboardCardResponse>>("/api/sideboard", TestJson.Options);
        Assert.Empty(sideboard!);
    }

    [Fact]
    public async Task Delete_WhenEntryBelongsToAnotherUser_ReturnsNotFound()
    {
        var owner = await TestAuth.RegisterAndLoginAsync(_factory);
        var intruder = await TestAuth.RegisterAndLoginAsync(_factory);
        var cardId = await AnyCardId(owner);
        var created = await owner.PostAsJsonAsync("/api/sideboard", new { cardId });
        var entry = (await created.Content.ReadFromJsonAsync<SideboardCardResponse>(TestJson.Options))!;

        var response = await intruder.DeleteAsync($"/api/sideboard/{entry.Id}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var sideboard = await owner.GetFromJsonAsync<List<SideboardCardResponse>>("/api/sideboard", TestJson.Options);
        Assert.Single(sideboard!);
    }

    private static async Task<int> AnyCardId(HttpClient client)
    {
        var page = await client.GetFromJsonAsync<CardPageResponse>("/api/card?pageSize=1", TestJson.Options);
        return page!.Cards[0].Id;
    }

    private record SideboardCardResponse(int Id, int CardId);

    private record CardPageResponse(int TotalCount, List<CardResponse> Cards);

    private record CardResponse(int Id, string Name);
}
