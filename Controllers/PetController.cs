using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CardCaptor.Data;

namespace CardCaptor.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PetController : ControllerBase
{
    private const double DecayPerMinute = 0.4;
    private const double MinFullness = 15;
    private const double FeedAmount = 22;

    private CardCaptorDbContext _dbContext;

    public PetController(CardCaptorDbContext context)
    {
        _dbContext = context;
    }

    private static double DecayedFullness(double storedFullness, DateTime lastFedAt)
    {
        var minutesSinceFed = (DateTime.UtcNow - lastFedAt).TotalMinutes;
        return Math.Max(MinFullness, storedFullness - minutesSinceFed * DecayPerMinute);
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var stage = PokemonStarters.GetStage(profile.PetFeedCount);
        var currentPokemon = PokemonStarters.GetCurrentStagePokemon(profile.StarterPokemon, profile.PetFeedCount);
        var nextThreshold = stage switch
        {
            1 => (int?)PokemonStarters.Stage2FeedThreshold,
            2 => (int?)PokemonStarters.Stage3FeedThreshold,
            _ => null
        };

        return Ok(new
        {
            starterPokemon = profile.StarterPokemon,
            currentPokemon,
            stage,
            feedCount = profile.PetFeedCount,
            fullness = DecayedFullness(profile.PetFullness, profile.PetLastFedAt),
            nextThreshold
        });
    }

    [HttpPost("feed")]
    [Authorize]
    public IActionResult Feed()
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var stageBefore = PokemonStarters.GetStage(profile.PetFeedCount);

        var decayedFullness = DecayedFullness(profile.PetFullness, profile.PetLastFedAt);
        profile.PetFullness = Math.Min(100, decayedFullness + FeedAmount);
        profile.PetLastFedAt = DateTime.UtcNow;
        profile.PetFeedCount += 1;
        _dbContext.SaveChanges();

        var stageAfter = PokemonStarters.GetStage(profile.PetFeedCount);
        var currentPokemon = PokemonStarters.GetCurrentStagePokemon(profile.StarterPokemon, profile.PetFeedCount);
        var nextThreshold = stageAfter switch
        {
            1 => (int?)PokemonStarters.Stage2FeedThreshold,
            2 => (int?)PokemonStarters.Stage3FeedThreshold,
            _ => null
        };

        return Ok(new
        {
            starterPokemon = profile.StarterPokemon,
            currentPokemon,
            stage = stageAfter,
            feedCount = profile.PetFeedCount,
            fullness = profile.PetFullness,
            nextThreshold,
            evolved = stageAfter > stageBefore
        });
    }
}
