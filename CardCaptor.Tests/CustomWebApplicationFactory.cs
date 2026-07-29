using CardCaptor.Data;
using CardCaptor.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CardCaptor.Tests;

// Swaps the real Postgres-backed CardCaptorDbContext for a Sqlite in-memory
// one so tests exercise the real ASP.NET Identity + cookie-auth pipeline
// without needing a live Postgres instance.
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Skips Program.cs's own db.Database.Migrate() call (see the
        // Environment check there) - several existing migrations embed raw
        // Postgres-only SQL (e.g. NOW() in AddPetToUserProfile), which has
        // no Sqlite equivalent. EnsureCreated() below builds schema straight
        // from the current model instead, sidestepping that entirely.
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["CardCaptorDbConnectionString"] = "Host=localhost;Database=unused;Username=unused;Password=unused",
                ["AdminPassword"] = "TestOnlyAdminPassword123!",
            });
        });

        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<CardCaptorDbContext>));
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            _connection.Open();
            services.AddDbContext<CardCaptorDbContext>(options => options.UseSqlite(_connection));
        });
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);
        using var scope = host.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CardCaptorDbContext>();
        db.Database.EnsureCreated();
        SeedCards(db);
        return host;
    }

    private static void SeedCards(CardCaptorDbContext db)
    {
        if (db.Cards.Any(c => c.SourceId.StartsWith("test-"))) return;

        var categories = new[] { "Pokemon", "Trainer", "Energy" };
        var rarities = new[] { "Common", "Uncommon", "Rare" };
        var eras = new[] { "Classic", "Sword & Shield", "Scarlet & Violet" };

        for (var i = 1; i <= 150; i++)
        {
            db.Cards.Add(new Card
            {
                Name = $"Test Card {i}",
                ImageUrl = $"https://example.com/{i}.png",
                Rarity = rarities[i % rarities.Length],
                Types = "Colorless",
                Category = categories[i % categories.Length],
                SetName = "Test Set",
                Era = eras[(i / rarities.Length) % eras.Length],
                SourceId = $"test-{i}",
            });
        }

        db.SaveChanges();
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing)
        {
            _connection.Dispose();
        }
    }
}
