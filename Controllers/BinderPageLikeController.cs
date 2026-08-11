using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CardCaptor.Models;
using CardCaptor.Models.DTOs;
using CardCaptor.Data;
using Microsoft.EntityFrameworkCore;

namespace CardCaptor.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BinderPageLikeController : ControllerBase
{
    private CardCaptorDbContext _dbContext;

    public BinderPageLikeController(CardCaptorDbContext context)
    {
        _dbContext = context;
    }

    [HttpPost]
    [Authorize]
    public IActionResult Create(LikeBinderPageDTO dto)
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var binderPage = _dbContext.BinderPages.SingleOrDefault(bp => bp.Id == dto.BinderPageId);
        if (binderPage == null) return NotFound();
        if (!binderPage.IsPublic) return NotFound();
        if (binderPage.UserProfileId == profile.Id) return BadRequest("You can't like your own page.");

        var alreadyLiked = _dbContext.BinderPageLikes
            .Any(bpl => bpl.BinderPageId == dto.BinderPageId && bpl.UserProfileId == profile.Id);
        if (alreadyLiked) return Conflict();

        var like = new BinderPageLike
        {
            BinderPageId = dto.BinderPageId,
            UserProfileId = profile.Id,
            CreatedAt = DateTime.UtcNow
        };
        _dbContext.BinderPageLikes.Add(like);
        _dbContext.SaveChanges();

        return Created($"/api/binderpagelike/{like.Id}", like);
    }

    [HttpDelete("{binderPageId}")]
    [Authorize]
    public IActionResult Delete(int binderPageId)
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var like = _dbContext.BinderPageLikes
            .SingleOrDefault(bpl => bpl.BinderPageId == binderPageId && bpl.UserProfileId == profile.Id);
        if (like == null) return NotFound();

        _dbContext.BinderPageLikes.Remove(like);
        _dbContext.SaveChanges();

        return NoContent();
    }
}
