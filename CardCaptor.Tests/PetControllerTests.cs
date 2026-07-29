using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace CardCaptor.Tests;

public class PetControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly WebApplicationFactory<Program> _factory;

    public PetControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Get_ForFreshUser_StartsAtStageOneWithChosenStarter()
    {
        var client = await TestAuth.RegisterAndLoginAsync(_factory, starterPokemon: "Charmander");

        var pet = await client.GetFromJsonAsync<PetResponse>("/api/pet", TestJson.Options);

        Assert.Equal("Charmander", pet!.StarterPokemon);
        Assert.Equal("Charmander", pet.CurrentPokemon);
        Assert.Equal(1, pet.Stage);
        Assert.Equal(0, pet.FeedCount);
    }

    [Fact]
    public async Task Feed_IncrementsFeedCountAndFullness()
    {
        var client = await TestAuth.RegisterAndLoginAsync(_factory, starterPokemon: "Squirtle");

        var fed = await client.PostAsync("/api/pet/feed", null);
        var result = await fed.Content.ReadFromJsonAsync<PetResponse>(TestJson.Options);

        Assert.Equal(1, result!.FeedCount);
        Assert.False(result.Evolved);
    }

    [Fact]
    public async Task Feed_TenTimes_EvolvesToStageTwo()
    {
        var client = await TestAuth.RegisterAndLoginAsync(_factory, starterPokemon: "Bulbasaur");

        PetResponse? last = null;
        for (var i = 0; i < 10; i++)
        {
            var fed = await client.PostAsync("/api/pet/feed", null);
            last = await fed.Content.ReadFromJsonAsync<PetResponse>(TestJson.Options);
        }

        Assert.Equal("Ivysaur", last!.CurrentPokemon);
        Assert.Equal(2, last.Stage);
        Assert.True(last.Evolved);
    }

    private record PetResponse(
        string StarterPokemon,
        string CurrentPokemon,
        int Stage,
        int FeedCount,
        double Fullness,
        int? NextThreshold,
        bool Evolved);
}
