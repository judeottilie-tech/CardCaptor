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

namespace CardCaptor.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private CardCaptorDbContext _dbContext;
    private UserManager<IdentityUser> _userManager;

    public AuthController(CardCaptorDbContext context, UserManager<IdentityUser> userManager)
    {
        _dbContext = context;
        _userManager = userManager;
    }

    [HttpPost("login")]
    public IActionResult Login([FromHeader(Name = "Authorization")] string authHeader)
    {
        try
        {
            string encodedCreds = authHeader.Substring(6).Trim();
            string creds = Encoding
                .GetEncoding("iso-8859-1")
                .GetString(Convert.FromBase64String(encodedCreds));

            int separator = creds.IndexOf(':');
            string username = creds.Substring(0, separator);
            string password = creds.Substring(separator + 1);

            var user = _dbContext.Users.FirstOrDefault(u => u.UserName == username);
            if (user == null)
            {
                return new UnauthorizedResult();
            }

            var hasher = new PasswordHasher<IdentityUser>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, password);

            if (result == PasswordVerificationResult.Success)
            {
                ResetDemoAccountIfNeeded(user);

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity)).Wait();

                return Ok();
            }

            return new UnauthorizedResult();
        }
        catch (Exception ex)
        {
            return StatusCode(500);
        }
    }

    // The demo account is shared by every visitor who clicks "Try Demo," so
    // whatever the previous visitor left behind (renamed/deleted binder,
    // filled slots, fed pet) gets wiped back to the pristine seeded state
    // the moment anyone logs in as DemoUser, rather than requiring a
    // scheduled background job.
    private void ResetDemoAccountIfNeeded(IdentityUser user)
    {
        if (user.UserName != "DemoUser") return;

        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == user.Id);
        if (profile == null) return;

        var existingPages = _dbContext.BinderPages.Where(bp => bp.UserProfileId == profile.Id);
        _dbContext.BinderPages.RemoveRange(existingPages);

        profile.StarterPokemon = "Bulbasaur";
        profile.PetFeedCount = 0;
        profile.PetFullness = 100;
        profile.PetLastFedAt = DateTime.UtcNow;
        _dbContext.SaveChanges();

        var demoBinder = new BinderPage
        {
            Title = "Demo Binder",
            CreatedAt = DateTime.UtcNow,
            UserProfileId = profile.Id
        };
        _dbContext.BinderPages.Add(demoBinder);
        _dbContext.SaveChanges();

        for (int position = 1; position <= 9; position++)
        {
            _dbContext.BinderPageCardSlots.Add(new BinderPageCardSlot
            {
                Position = position,
                BinderPageId = demoBinder.Id
            });
        }
        _dbContext.SaveChanges();
    }

    [HttpGet]
    [Route("logout")]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public IActionResult Logout()
    {
        try
        {
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme).Wait();
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500);
        }
    }

    [HttpGet("Me")]
    [Authorize]
    public IActionResult Me()
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var profile = _dbContext.UserProfiles.SingleOrDefault(up => up.IdentityUserId == identityUserId);
        if (profile != null)
        {
            var userDto = new UserProfileDTO
            {
                Id = profile.Id,
                DisplayName = profile.DisplayName,
                UserName = User.FindFirstValue(ClaimTypes.Name),
                IdentityUserId = identityUserId

            };

            return Ok(userDto);
        }
        return NotFound();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegistrationDTO registration)
    {
        if (!PokemonStarters.IsValidStarter(registration.StarterPokemon))
        {
            return BadRequest("Invalid starter Pokemon.");
        }

        string password;
        try
        {
            password = Encoding
                .GetEncoding("iso-8859-1")
                .GetString(Convert.FromBase64String(registration.Password));
        }
        catch (Exception)
        {
            return BadRequest("Invalid password encoding.");
        }

        var user = new IdentityUser
        {
            UserName = registration.UserName
        };

        var result = await _userManager.CreateAsync(user, password);
        if (result.Succeeded)
        {
            _dbContext.UserProfiles.Add(new UserProfile
            {
                DisplayName = registration.DisplayName,
                IdentityUserId = user.Id,
                StarterPokemon = registration.StarterPokemon,
                PetFeedCount = 0,
                PetFullness = 100,
                PetLastFedAt = DateTime.UtcNow
            });
            _dbContext.SaveChanges();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName.ToString())
            };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity)
            ).Wait();
            return Ok();
        }
        return StatusCode(500);
    }
}
