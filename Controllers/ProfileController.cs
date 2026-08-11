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
                bp.CreatedAt,
                likeCount = _dbContext.BinderPageLikes.Count(bpl => bpl.BinderPageId == bp.Id)
            })
            .ToList();

        // Only pages that are still public today should show up here - if the
        // owner has since made a liked page private, showing it would leak its
        // title/existence through someone else's profile.
        var likedPages = _dbContext.BinderPageLikes
            .Where(bpl => bpl.UserProfileId == profile.Id && bpl.BinderPage.IsPublic)
            .Select(bpl => new
            {
                bpl.BinderPage.Id,
                bpl.BinderPage.Title,
                bpl.BinderPage.Description,
                ownerUserName = bpl.BinderPage.UserProfile.IdentityUser.UserName,
                ownerDisplayName = bpl.BinderPage.UserProfile.DisplayName
            })
            .ToList();

        return Ok(new
        {
            displayName = profile.DisplayName,
            userName = user.UserName,
            currentPokemon = PokemonStarters.GetCurrentStagePokemon(profile.StarterPokemon, profile.PetFeedCount),
            stage = PokemonStarters.GetStage(profile.PetFeedCount),
            binderPages = publicBinderPages,
            likedPages
        });
    }
}
