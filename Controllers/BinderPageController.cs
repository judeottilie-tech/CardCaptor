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

    // post /api/binderpage

    [HttpPost]
    [Authorize]

    public IActionResult Create(CreateBinderPageDTO dto)
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile == null) return NotFound();

        var binderPage = new BinderPage
        {
          Title = dto.Title,
          UserProfileId = profile.Id,
          CreatedAt = DateTime.UtcNow  
        };
        _dbContext.BinderPages.Add(binderPage);
        _dbContext.SaveChanges();

        for (int position = 1; position <= 9; position++)
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

    //delete /api/binderpage/{id}

}