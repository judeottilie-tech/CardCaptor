using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace CardCaptor.Tests;

public class BinderPageControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly WebApplicationFactory<Program> _factory;

    public BinderPageControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Create_MakesPageWithNineEmptySlots()
    {
        var client = await TestAuth.RegisterAndLoginAsync(_factory);

        var created = await CreatePage(client, "My Binder");

        var detail = await client.GetFromJsonAsync<BinderPageResponse>($"/api/binderpage/{created.Id}", TestJson.Options);
        Assert.Equal(9, detail!.BinderPageCardSlots.Count);
        Assert.All(detail.BinderPageCardSlots, slot => Assert.Null(slot.CardId));
    }

    [Fact]
    public async Task Get_OnlyReturnsCurrentUsersPages()
    {
        var clientA = await TestAuth.RegisterAndLoginAsync(_factory);
        var clientB = await TestAuth.RegisterAndLoginAsync(_factory);

        await CreatePage(clientA, "A's Page");
        await CreatePage(clientB, "B's Page 1");
        await CreatePage(clientB, "B's Page 2");

        var pagesForB = await clientB.GetFromJsonAsync<List<BinderPageResponse>>("/api/binderpage", TestJson.Options);

        Assert.Equal(2, pagesForB!.Count);
        Assert.All(pagesForB, p => Assert.Contains("B's Page", p.Title));
    }

    [Fact]
    public async Task GetById_WhenNotOwner_ReturnsNotFound()
    {
        var owner = await TestAuth.RegisterAndLoginAsync(_factory);
        var intruder = await TestAuth.RegisterAndLoginAsync(_factory);
        var page = await CreatePage(owner, "Private Page");

        var response = await intruder.GetAsync($"/api/binderpage/{page.Id}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Update_WhenNotOwner_ReturnsNotFoundAndDoesNotChangeTitle()
    {
        var owner = await TestAuth.RegisterAndLoginAsync(_factory);
        var intruder = await TestAuth.RegisterAndLoginAsync(_factory);
        var page = await CreatePage(owner, "Original Title");

        var response = await intruder.PutAsJsonAsync($"/api/binderpage/{page.Id}", new
        {
            title = "Hijacked Title",
            description = (string?)null,
        });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        var stillOwned = await owner.GetFromJsonAsync<BinderPageResponse>($"/api/binderpage/{page.Id}", TestJson.Options);
        Assert.Equal("Original Title", stillOwned!.Title);
    }

    [Fact]
    public async Task Update_WhenOwner_ChangesTitleAndDescription()
    {
        var owner = await TestAuth.RegisterAndLoginAsync(_factory);
        var page = await CreatePage(owner, "Old Title");

        var response = await owner.PutAsJsonAsync($"/api/binderpage/{page.Id}", new
        {
            title = "New Title",
            description = "New description",
        });

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var updated = await owner.GetFromJsonAsync<BinderPageResponse>($"/api/binderpage/{page.Id}", TestJson.Options);
        Assert.Equal("New Title", updated!.Title);
        Assert.Equal("New description", updated.Description);
    }

    [Fact]
    public async Task Delete_WhenNotOwner_ReturnsNotFoundAndPageSurvives()
    {
        var owner = await TestAuth.RegisterAndLoginAsync(_factory);
        var intruder = await TestAuth.RegisterAndLoginAsync(_factory);
        var page = await CreatePage(owner, "Keep Me");

        var response = await intruder.DeleteAsync($"/api/binderpage/{page.Id}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var stillThere = await owner.GetAsync($"/api/binderpage/{page.Id}");
        Assert.Equal(HttpStatusCode.OK, stillThere.StatusCode);
    }

    [Fact]
    public async Task Delete_WhenOwner_RemovesPage()
    {
        var owner = await TestAuth.RegisterAndLoginAsync(_factory);
        var page = await CreatePage(owner, "Delete Me");

        var response = await owner.DeleteAsync($"/api/binderpage/{page.Id}");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        var afterDelete = await owner.GetAsync($"/api/binderpage/{page.Id}");
        Assert.Equal(HttpStatusCode.NotFound, afterDelete.StatusCode);
    }

    private static async Task<BinderPageResponse> CreatePage(HttpClient client, string title)
    {
        var response = await client.PostAsJsonAsync("/api/binderpage", new { title, description = (string?)null });
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<BinderPageResponse>(TestJson.Options))!;
    }

    private record BinderPageResponse(
        int Id,
        string Title,
        string? Description,
        int UserProfileId,
        List<SlotResponse> BinderPageCardSlots);

    private record SlotResponse(int Id, int Position, int? CardId);
}
