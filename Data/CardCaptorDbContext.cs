using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CardCaptor.Models;

namespace CardCaptor.Data;

public class CardCaptorDbContext : IdentityDbContext<IdentityUser>
{
    private readonly IConfiguration _configuration;

    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<BinderPage> BinderPages { get; set; }
    public DbSet<Card> Cards { get; set; }
    public DbSet<BinderPageCardSlot> BinderPageCardSlots { get; set; }

    public CardCaptorDbContext(DbContextOptions<CardCaptorDbContext> context, IConfiguration config) : base(context)
    {
        _configuration = config;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IdentityUser>().HasData(new IdentityUser
        {
            Id = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
            UserName = "Administrator",
            Email = "admin@cardcaptor.comx",
            PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(null, _configuration["AdminPassword"])
        });

        modelBuilder.Entity<UserProfile>().HasData(new UserProfile
        {
            Id = 1,
            IdentityUserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
            DisplayName = "Administrator"
        });

        modelBuilder.Entity<IdentityUser>().HasData(new IdentityUser
        {
            Id = "14e95ce0-ccca-4a12-a26d-6354d318ac70",
            UserName = "DemoUser",
            Email = "demo@cardcaptor.comx",
            PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(null, "Demo1234")
        });

        modelBuilder.Entity<UserProfile>().HasData(new UserProfile
        {
            Id = 2,
            IdentityUserId = "14e95ce0-ccca-4a12-a26d-6354d318ac70",
            DisplayName = "Demo User"
        });

        modelBuilder.Entity<BinderPage>().HasData(new BinderPage
        {
            Id = 1,
            Title = "Demo Binder",
            CreatedAt = new DateTime(2026, 7, 23),
            UserProfileId = 2
        });

        modelBuilder.Entity<BinderPageCardSlot>().HasData(new BinderPageCardSlot[]
        {
            new BinderPageCardSlot { Id = 1, Position = 1, BinderPageId = 1, CardId = 4 },
            new BinderPageCardSlot { Id = 2, Position = 2, BinderPageId = 1, CardId = 15 },
            new BinderPageCardSlot { Id = 3, Position = 3, BinderPageId = 1, CardId = 2 },
            new BinderPageCardSlot { Id = 4, Position = 4, BinderPageId = 1, CardId = 10 },
            new BinderPageCardSlot { Id = 5, Position = 5, BinderPageId = 1, CardId = null },
            new BinderPageCardSlot { Id = 6, Position = 6, BinderPageId = 1, CardId = null },
            new BinderPageCardSlot { Id = 7, Position = 7, BinderPageId = 1, CardId = null },
            new BinderPageCardSlot { Id = 8, Position = 8, BinderPageId = 1, CardId = null },
            new BinderPageCardSlot { Id = 9, Position = 9, BinderPageId = 1, CardId = null },
        });

        modelBuilder.Entity<Card>().HasData(new Card[]
        {
            new Card { Id = 1, Name = "Alakazam", ImageUrl = "https://tcg.one/scans/l/base_set/1.jpg" },
            new Card { Id = 2, Name = "Blastoise", ImageUrl = "https://tcg.one/scans/l/base_set/2.jpg" },
            new Card { Id = 3, Name = "Chansey", ImageUrl = "https://tcg.one/scans/l/base_set/3.jpg" },
            new Card { Id = 4, Name = "Charizard", ImageUrl = "https://tcg.one/scans/l/base_set/4.jpg" },
            new Card { Id = 5, Name = "Clefairy", ImageUrl = "https://tcg.one/scans/l/base_set/5.jpg" },
            new Card { Id = 6, Name = "Gyarados", ImageUrl = "https://tcg.one/scans/l/base_set/6.jpg" },
            new Card { Id = 7, Name = "Hitmonchan", ImageUrl = "https://tcg.one/scans/l/base_set/7.jpg" },
            new Card { Id = 8, Name = "Machamp", ImageUrl = "https://tcg.one/scans/l/base_set/8.jpg" },
            new Card { Id = 9, Name = "Magneton", ImageUrl = "https://tcg.one/scans/l/base_set/9.jpg" },
            new Card { Id = 10, Name = "Mewtwo", ImageUrl = "https://tcg.one/scans/l/base_set/10.jpg" },
            new Card { Id = 11, Name = "Nidoking", ImageUrl = "https://tcg.one/scans/l/base_set/11.jpg" },
            new Card { Id = 12, Name = "Ninetales", ImageUrl = "https://tcg.one/scans/l/base_set/12.jpg" },
            new Card { Id = 13, Name = "Poliwrath", ImageUrl = "https://tcg.one/scans/l/base_set/13.jpg" },
            new Card { Id = 14, Name = "Raichu", ImageUrl = "https://tcg.one/scans/l/base_set/14.jpg" },
            new Card { Id = 15, Name = "Venusaur", ImageUrl = "https://tcg.one/scans/l/base_set/15.jpg" },
            new Card { Id = 16, Name = "Zapdos", ImageUrl = "https://tcg.one/scans/l/base_set/16.jpg" },
            new Card { Id = 17, Name = "Beedrill", ImageUrl = "https://tcg.one/scans/l/base_set/17.jpg" },
            new Card { Id = 18, Name = "Dragonair", ImageUrl = "https://tcg.one/scans/l/base_set/18.jpg" },
            new Card { Id = 19, Name = "Dugtrio", ImageUrl = "https://tcg.one/scans/l/base_set/19.jpg" },
            new Card { Id = 20, Name = "Electabuzz", ImageUrl = "https://tcg.one/scans/l/base_set/20.jpg" },
            new Card { Id = 21, Name = "Electrode", ImageUrl = "https://tcg.one/scans/l/base_set/21.jpg" },
            new Card { Id = 22, Name = "Pidgeotto", ImageUrl = "https://tcg.one/scans/l/base_set/22.jpg" },
            new Card { Id = 23, Name = "Arcanine", ImageUrl = "https://tcg.one/scans/l/base_set/23.jpg" },
            new Card { Id = 24, Name = "Charmeleon", ImageUrl = "https://tcg.one/scans/l/base_set/24.jpg" },
            new Card { Id = 25, Name = "Dewgong", ImageUrl = "https://tcg.one/scans/l/base_set/25.jpg" },
            new Card { Id = 26, Name = "Dratini", ImageUrl = "https://tcg.one/scans/l/base_set/26.jpg" },
            new Card { Id = 27, Name = "Farfetch'd", ImageUrl = "https://tcg.one/scans/l/base_set/27.jpg" },
            new Card { Id = 28, Name = "Growlithe", ImageUrl = "https://tcg.one/scans/l/base_set/28.jpg" },
            new Card { Id = 29, Name = "Haunter", ImageUrl = "https://tcg.one/scans/l/base_set/29.jpg" },
            new Card { Id = 30, Name = "Ivysaur", ImageUrl = "https://tcg.one/scans/l/base_set/30.jpg" },
            new Card { Id = 31, Name = "Jynx", ImageUrl = "https://tcg.one/scans/l/base_set/31.jpg" },
            new Card { Id = 32, Name = "Kadabra", ImageUrl = "https://tcg.one/scans/l/base_set/32.jpg" },
            new Card { Id = 33, Name = "Kakuna", ImageUrl = "https://tcg.one/scans/l/base_set/33.jpg" },
            new Card { Id = 34, Name = "Machoke", ImageUrl = "https://tcg.one/scans/l/base_set/34.jpg" },
            new Card { Id = 35, Name = "Magikarp", ImageUrl = "https://tcg.one/scans/l/base_set/35.jpg" },
            new Card { Id = 36, Name = "Magmar", ImageUrl = "https://tcg.one/scans/l/base_set/36.jpg" },
            new Card { Id = 37, Name = "Nidorino", ImageUrl = "https://tcg.one/scans/l/base_set/37.jpg" },
            new Card { Id = 38, Name = "Poliwhirl", ImageUrl = "https://tcg.one/scans/l/base_set/38.jpg" },
            new Card { Id = 39, Name = "Porygon", ImageUrl = "https://tcg.one/scans/l/base_set/39.jpg" },
            new Card { Id = 40, Name = "Raticate", ImageUrl = "https://tcg.one/scans/l/base_set/40.jpg" },
            new Card { Id = 41, Name = "Seel", ImageUrl = "https://tcg.one/scans/l/base_set/41.jpg" },
            new Card { Id = 42, Name = "Wartortle", ImageUrl = "https://tcg.one/scans/l/base_set/42.jpg" },
            new Card { Id = 43, Name = "Abra", ImageUrl = "https://tcg.one/scans/l/base_set/43.jpg" },
            new Card { Id = 44, Name = "Bulbasaur", ImageUrl = "https://tcg.one/scans/l/base_set/44.jpg" },
            new Card { Id = 45, Name = "Caterpie", ImageUrl = "https://tcg.one/scans/l/base_set/45.jpg" },
            new Card { Id = 46, Name = "Charmander", ImageUrl = "https://tcg.one/scans/l/base_set/46.jpg" },
            new Card { Id = 47, Name = "Diglett", ImageUrl = "https://tcg.one/scans/l/base_set/47.jpg" },
            new Card { Id = 48, Name = "Doduo", ImageUrl = "https://tcg.one/scans/l/base_set/48.jpg" },
            new Card { Id = 49, Name = "Drowzee", ImageUrl = "https://tcg.one/scans/l/base_set/49.jpg" },
            new Card { Id = 50, Name = "Gastly", ImageUrl = "https://tcg.one/scans/l/base_set/50.jpg" },
        });
    }
}
