using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CardCaptor.Data;
using Microsoft.EntityFrameworkCore;

namespace CardCaptor.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private CardCaptorDbContext _dbContext;

    public ProfileController(CardCaptorDbContext context)
    {
        _dbContext = context;
    }

    //get /api/profile/{userName}

    [HttpGet("{userName}")]
    [AllowAnonymous]
    public IActionResult Get(string userName)
    {
        var user = _dbContext.Users.SingleOrDefault(u => u.UserName == userName);
        if (user == null) return NotFound();

        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == user.Id);
        if (profile == null) return NotFound();

        var publicBinderPages = _dbContext.BinderPages
            .Where(bp => bp.UserProfileId == profile.Id && bp.IsPublic)
            .Select(bp => new
            {
                bp.Id,
                bp.Title,
                bp.Description,
                bp.Rows,
                bp.Columns,
                bp.CreatedAt
            })
            .ToList();

        return Ok(new
        {
            displayName = profile.DisplayName,
            userName = user.UserName,
            currentPokemon = PokemonStarters.GetCurrentStagePokemon(profile.StarterPokemon, profile.PetFeedCount),
            stage = PokemonStarters.GetStage(profile.PetFeedCount),
            binderPages = publicBinderPages
        });
    }
}
