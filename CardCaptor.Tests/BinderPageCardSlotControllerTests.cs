using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace CardCaptor.Tests;

public class BinderPageCardSlotControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly WebApplicationFactory<Program> _factory;

    public BinderPageCardSlotControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Update_WhenOwner_AttachesCardToSlot()
    {
        var owner = await TestAuth.RegisterAndLoginAsync(_factory);
        var page = await CreatePage(owner, "Attach Test");
        var slotId = page.BinderPageCardSlots[0].Id;
        var cardId = await AnyCardId(owner);

        var response = await owner.PutAsJsonAsync($"/api/binderpagecardslot/{slotId}/card", new { cardId });

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        var reloaded = await owner.GetFromJsonAsync<BinderPageResponse>($"/api/binderpage/{page.Id}", TestJson.Options);
        Assert.Equal(cardId, reloaded!.BinderPageCardSlots.Single(s => s.Id == slotId).CardId);
    }

    [Fact]
    public async Task Update_WhenSlotBelongsToAnotherUsersPage_ReturnsNotFound()
    {
        var owner = await TestAuth.RegisterAndLoginAsync(_factory);
        var intruder = await TestAuth.RegisterAndLoginAsync(_factory);
        var page = await CreatePage(owner, "Not Yours");
        var slotId = page.BinderPageCardSlots[0].Id;
        var cardId = await AnyCardId(owner);

        var response = await intruder.PutAsJsonAsync($"/api/binderpagecardslot/{slotId}/card", new { cardId });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var reloaded = await owner.GetFromJsonAsync<BinderPageResponse>($"/api/binderpage/{page.Id}", TestJson.Options);
        Assert.Null(reloaded!.BinderPageCardSlots.Single(s => s.Id == slotId).CardId);
    }

    [Fact]
    public async Task Delete_WhenOwner_ClearsCardFromSlot()
    {
        var owner = await TestAuth.RegisterAndLoginAsync(_factory);
        var page = await CreatePage(owner, "Remove Test");
        var slotId = page.BinderPageCardSlots[0].Id;
        var cardId = await AnyCardId(owner);
        await owner.PutAsJsonAsync($"/api/binderpagecardslot/{slotId}/card", new { cardId });

        var response = await owner.DeleteAsync($"/api/binderpagecardslot/{slotId}/card");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        var reloaded = await owner.GetFromJsonAsync<BinderPageResponse>($"/api/binderpage/{page.Id}", TestJson.Options);
        Assert.Null(reloaded!.BinderPageCardSlots.Single(s => s.Id == slotId).CardId);
    }

    [Fact]
    public async Task Delete_WhenSlotBelongsToAnotherUsersPage_ReturnsNotFound()
    {
        var owner = await TestAuth.RegisterAndLoginAsync(_factory);
        var intruder = await TestAuth.RegisterAndLoginAsync(_factory);
        var page = await CreatePage(owner, "Protected Slot");
        var slotId = page.BinderPageCardSlots[0].Id;
        var cardId = await AnyCardId(owner);
        await owner.PutAsJsonAsync($"/api/binderpagecardslot/{slotId}/card", new { cardId });

        var response = await intruder.DeleteAsync($"/api/binderpagecardslot/{slotId}/card");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var reloaded = await owner.GetFromJsonAsync<BinderPageResponse>($"/api/binderpage/{page.Id}", TestJson.Options);
        Assert.Equal(cardId, reloaded!.BinderPageCardSlots.Single(s => s.Id == slotId).CardId);
    }

    private static async Task<BinderPageResponse> CreatePage(HttpClient client, string title)
    {
        var response = await client.PostAsJsonAsync("/api/binderpage", new { title, description = (string?)null });
        response.EnsureSuccessStatusCode();
        var created = (await response.Content.ReadFromJsonAsync<BinderPageResponse>(TestJson.Options))!;
        return (await client.GetFromJsonAsync<BinderPageResponse>($"/api/binderpage/{created.Id}", TestJson.Options))!;
    }

    private static async Task<int> AnyCardId(HttpClient client)
    {
        var page = await client.GetFromJsonAsync<CardPageResponse>("/api/card?pageSize=1", TestJson.Options);
        return page!.Cards[0].Id;
    }

    private record BinderPageResponse(int Id, string Title, string? Description, List<SlotResponse> BinderPageCardSlots);

    private record SlotResponse(int Id, int Position, int? CardId);

    private record CardPageResponse(int TotalCount, List<CardResponse> Cards);

    private record CardResponse(int Id, string Name);
}
