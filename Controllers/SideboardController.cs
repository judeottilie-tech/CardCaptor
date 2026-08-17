using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using CardCaptor.Models;
using CardCaptor.Models.DTOs;
using CardCaptor.Data;
using Microsoft.EntityFrameworkCore;

namespace CardCaptor.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SideboardController : ControllerBase
{
    private CardCaptorDbContext _dbContext;

    public SideboardController(CardCaptorDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get([FromQuery] int binderPageId)
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var binderPage = _dbContext.BinderPages.SingleOrDefault(bp => bp.Id == binderPageId);
        if (binderPage == null) return NotFound();
        if (binderPage.UserProfileId != profile.Id) return NotFound();

        var sideboardCards = _dbContext.SideboardCards
            .Include(sc => sc.Card)
            .Where(sc => sc.BinderPageId == binderPageId)
            .ToList();

        return Ok(sideboardCards);
    }

    [HttpPost]
    [Authorize]
    public IActionResult Create(AddToSideboardDTO dto)
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var binderPage = _dbContext.BinderPages.SingleOrDefault(bp => bp.Id == dto.BinderPageId);
        if (binderPage == null) return NotFound();
        if (binderPage.UserProfileId != profile.Id) return NotFound();

        var sideboardCard = new SideboardCard
        {
            BinderPageId = dto.BinderPageId,
            CardId = dto.CardId,
            AddedAt = DateTime.UtcNow
        };
        _dbContext.SideboardCards.Add(sideboardCard);
        _dbContext.SaveChanges();

        return Created($"/api/sideboard/{sideboardCard.Id}", sideboardCard);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult Delete(int id)
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var sideboardCard = _dbContext.SideboardCards
            .Include(sc => sc.BinderPage)
            .SingleOrDefault(sc => sc.Id == id);
        if (sideboardCard == null) return NotFound();
        if (sideboardCard.BinderPage.UserProfileId != profile.Id) return NotFound();

        _dbContext.SideboardCards.Remove(sideboardCard);
        _dbContext.SaveChanges();

        return NoContent();
    }
}
