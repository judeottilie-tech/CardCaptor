using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CardCaptor.Data;
namespace CardCaptor.Controllers;

using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")]
public class CardController : ControllerBase
{
    private CardCaptorDbContext _dbContext;

    public CardController(CardCaptorDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get(string? search, string? category, string? rarity, string? era)
    {
        var query = _dbContext.Cards.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(c => EF.Functions.ILike(c.Name, $"%{search}%"));
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(c => c.Category == category);
        }

        if (!string.IsNullOrWhiteSpace(rarity))
        {
            query = query.Where(c => c.Rarity == rarity);
        }

        if (!string.IsNullOrWhiteSpace(era))
        {
            query = query.Where(c => c.Era == era);
        }

        return Ok(query.ToList());
    }
};

