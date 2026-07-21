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
public class BinderPageCardSlotController : ControllerBase
{
    private CardCaptorDbContext _dbContext;

    public BinderPageCardSlotController(CardCaptorDbContext context)
    {
        _dbContext = context;
    }

    [HttpPut("{id}/card")]
    [Authorize]
    public IActionResult Update(int id, AttachCardDTO dto)
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var slot = _dbContext.BinderPageCardSlots
            .Include(bpcs => bpcs.BinderPage)
            .SingleOrDefault(bpcs => bpcs.Id == id);

        if (slot == null) return NotFound();
        if (slot.BinderPage.UserProfileId != profile.Id) return NotFound();

        slot.CardId = dto.CardId;
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpDelete("{id}/card")]
    [Authorize]
    public IActionResult Delete(int id)
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var slot = _dbContext.BinderPageCardSlots
            .Include(bpcs => bpcs.BinderPage)
            .SingleOrDefault(bpcs => bpcs.Id == id);

        if (slot == null) return NotFound();
        if (slot.BinderPage.UserProfileId != profile.Id) return NotFound();

        slot.CardId = null;
        _dbContext.SaveChanges();

        return NoContent();
    }
}