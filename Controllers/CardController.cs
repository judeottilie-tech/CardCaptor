using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CardCaptor.Data;
namespace CardCaptor.Controllers;

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
    public IActionResult Get()
    {
        return Ok(_dbContext.Cards.ToList());
    }
};