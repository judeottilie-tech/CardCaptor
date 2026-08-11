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

//get /api/binderpage
public class BinderPageController : ControllerBase
{
    private CardCaptorDbContext _dbContext;

    public BinderPageController(CardCaptorDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var binderPages = _dbContext.BinderPages
            .Where(bp => bp.UserProfileId == profile.Id)
            .ToList();

        return Ok(binderPages);
    }


//get /api/binderpage/{id}


    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(int id)
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();
        
        var binderPage = _dbContext.BinderPages
            .Include(bp => bp.BinderPageCardSlots)
                .ThenInclude(bpcs => bpcs.Card)
            .SingleOrDefault(bp => bp.Id == id);

        if (binderPage == null) return NotFound();
        if (binderPage.UserProfileId != profile.Id) return NotFound();
        return Ok(binderPage);
    }

    //get /api/binderpage/{id}/public

    [HttpGet("{id}/public")]
    [AllowAnonymous]
    public IActionResult GetPublic(int id)
    {
        var binderPage = _dbContext.BinderPages
            .Include(bp => bp.BinderPageCardSlots)
                .ThenInclude(bpcs => bpcs.Card)
            .SingleOrDefault(bp => bp.Id == id);

        if (binderPage == null) return NotFound();
        if (!binderPage.IsPublic) return NotFound();
        return Ok(binderPage);
    }

    // post /api/binderpage

    [HttpPost]
    [Authorize]

    public IActionResult Create(CreateBinderPageDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title)) return BadRequest("Title is required.");
        if (!BinderPageLayouts.IsValid(dto.Rows, dto.Columns)) return BadRequest("Invalid layout.");

        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var binderPage = new BinderPage
        {
          Title = dto.Title,
          Description = dto.Description,
          Rows = dto.Rows,
          Columns = dto.Columns,
          IsPublic = dto.IsPublic,
          UserProfileId = profile.Id,
          CreatedAt = DateTime.UtcNow
        };
        _dbContext.BinderPages.Add(binderPage);
        _dbContext.SaveChanges();

        for (int position = 1; position <= dto.Rows * dto.Columns; position++)
        {
            _dbContext.BinderPageCardSlots.Add(new BinderPageCardSlot {
              Position = position,
              BinderPageId = binderPage.Id
            });
        }
        _dbContext.SaveChanges();

        return Created($"/api/binderpage/{binderPage.Id}", binderPage);
    }

    //put /api/binderpage/{id}

    [HttpPut("{id}")]
    [Authorize]

    public IActionResult Update(int id, CreateBinderPageDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title)) return BadRequest("Title is required.");

        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var binderPage = _dbContext.BinderPages.SingleOrDefault(bp => bp.Id == id);
        if (binderPage == null) return NotFound();
        if (binderPage.UserProfileId != profile.Id) return NotFound();

        binderPage.Title = dto.Title;
        binderPage.Description = dto.Description;
        binderPage.IsPublic = dto.IsPublic;
        _dbContext.SaveChanges();

        return NoContent();

    }

    //put /api/binderpage/{id}/layout

    [HttpPut("{id}/layout")]
    [Authorize]

    public IActionResult UpdateLayout(int id, UpdateLayoutDTO dto)
    {
        if (!BinderPageLayouts.IsValid(dto.Rows, dto.Columns)) return BadRequest("Invalid layout.");

        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var binderPage = _dbContext.BinderPages
            .Include(bp => bp.BinderPageCardSlots)
            .SingleOrDefault(bp => bp.Id == id);

        if (binderPage == null) return NotFound();
        if (binderPage.UserProfileId != profile.Id) return NotFound();

        var newSlotCount = dto.Rows * dto.Columns;

        var slotsToRemove = binderPage.BinderPageCardSlots
            .Where(slot => slot.Position > newSlotCount)
            .ToList();

        foreach (var slot in slotsToRemove)
        {
            if (slot.CardId != null)
            {
                _dbContext.SideboardCards.Add(new SideboardCard
                {
                    UserProfileId = profile.Id,
                    CardId = slot.CardId.Value,
                    AddedAt = DateTime.UtcNow
                });
            }
        }
        _dbContext.BinderPageCardSlots.RemoveRange(slotsToRemove);

        var currentSlotCount = binderPage.BinderPageCardSlots.Count;
        for (int position = currentSlotCount + 1; position <= newSlotCount; position++)
        {
            _dbContext.BinderPageCardSlots.Add(new BinderPageCardSlot
            {
                Position = position,
                BinderPageId = binderPage.Id
            });
        }

        binderPage.Rows = dto.Rows;
        binderPage.Columns = dto.Columns;
        _dbContext.SaveChanges();

        var updated = _dbContext.BinderPages
            .Include(bp => bp.BinderPageCardSlots)
                .ThenInclude(bpcs => bpcs.Card)
            .Single(bp => bp.Id == id);

        return Ok(updated);
    }

    //delete /api/binderpage/{id}

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult Delete(int id)
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var binderPage = _dbContext.BinderPages.SingleOrDefault(bp => bp.Id == id);
        if (binderPage == null) return NotFound();
        if (binderPage.UserProfileId != profile.Id) return NotFound();

        _dbContext.BinderPages.Remove(binderPage);
        _dbContext.SaveChanges();
        return NoContent();
    }

}