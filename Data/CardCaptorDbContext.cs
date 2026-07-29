using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CardCaptor.Models;

namespace CardCaptor.Data;

public class CardCaptorDbContext : IdentityDbContext<IdentityUser>
{
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<BinderPage> BinderPages { get; set; }
    public DbSet<Card> Cards { get; set; }
    public DbSet<BinderPageCardSlot> BinderPageCardSlots { get; set; }

    public CardCaptorDbContext(DbContextOptions<CardCaptorDbContext> context) : base(context)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IdentityUser>().HasData(new IdentityUser
        {
            Id = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
            UserName = "Administrator",
            Email = "admin@cardcaptor.comx",
            ConcurrencyStamp = "1ac5ed5e-321b-43a5-b5cf-601f116f2bc8",
            SecurityStamp = "d0421a93-dfa7-4b35-9b06-c6254a3482cc",
            PasswordHash = "AQAAAAIAAYagAAAAELeRD5li3MF+nAJ9iMNI/VKQbd5ZG9hmkK4GCTB98QQA5rRUAustisDll7qQJ6r8Gw=="
        });

        modelBuilder.Entity<UserProfile>().HasData(new UserProfile
        {
            Id = 1,
            IdentityUserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
            DisplayName = "Administrator",
            StarterPokemon = "Bulbasaur",
            PetFeedCount = 0,
            PetFullness = 100,
            PetLastFedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });

        modelBuilder.Entity<Card>().HasIndex(c => c.SourceId).IsUnique();

        modelBuilder.Entity<IdentityUser>().HasData(new IdentityUser
        {
            Id = "14e95ce0-ccca-4a12-a26d-6354d318ac70",
            UserName = "DemoUser",
            Email = "demo@cardcaptor.comx",
            ConcurrencyStamp = "d589739e-9dd7-4586-b3ad-47e17346df25",
            SecurityStamp = "156d41da-d344-4a10-9d95-31e08decba92",
            PasswordHash = "AQAAAAIAAYagAAAAEGfhBSqTZy9X/pudDnRxhjAEo35uUukm2f8FNovsAAIPDt8ZrtzYacz3fdrAQicxgw=="
        });

        modelBuilder.Entity<UserProfile>().HasData(new UserProfile
        {
            Id = 2,
            IdentityUserId = "14e95ce0-ccca-4a12-a26d-6354d318ac70",
            DisplayName = "Demo User",
            StarterPokemon = "Bulbasaur",
            PetFeedCount = 0,
            PetFullness = 100,
            PetLastFedAt = new DateTime(2026, 7, 23, 0, 0, 0, DateTimeKind.Utc)
        });

        modelBuilder.Entity<BinderPage>().HasData(new BinderPage
        {
            Id = 1,
            Title = "Demo Binder",
            CreatedAt = new DateTime(2026, 7, 23),
            UserProfileId = 2
        });

        // All 9 slots start empty rather than pointing at specific Card ids:
        // the old hand-seeded 50-card catalog these used to reference (Charizard=4,
        // Venusaur=15, Blastoise=2, Mewtwo=10) no longer exists on this schema -
        // cards now come from the live TCGdex import (CardImportService), which
        // assigns its own ids at import time, not at migration-definition time.
        modelBuilder.Entity<BinderPageCardSlot>().HasData(new BinderPageCardSlot[]
        {
            new BinderPageCardSlot { Id = 1, Position = 1, BinderPageId = 1, CardId = null },
            new BinderPageCardSlot { Id = 2, Position = 2, BinderPageId = 1, CardId = null },
            new BinderPageCardSlot { Id = 3, Position = 3, BinderPageId = 1, CardId = null },
            new BinderPageCardSlot { Id = 4, Position = 4, BinderPageId = 1, CardId = null },
            new BinderPageCardSlot { Id = 5, Position = 5, BinderPageId = 1, CardId = null },
            new BinderPageCardSlot { Id = 6, Position = 6, BinderPageId = 1, CardId = null },
            new BinderPageCardSlot { Id = 7, Position = 7, BinderPageId = 1, CardId = null },
            new BinderPageCardSlot { Id = 8, Position = 8, BinderPageId = 1, CardId = null },
            new BinderPageCardSlot { Id = 9, Position = 9, BinderPageId = 1, CardId = null },
        });
    }
}
