using System.Net.Http.Json;
using System.Text.Json;
using CardCaptor.Data;
using CardCaptor.Models;

namespace CardCaptor.Services;

// run via: dotnet run -- --import-cards

public class CardImportService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private static readonly string[] ClassicSetIds = { "base1", "base2", "base3", "base5", "neo4" };

    private static readonly Dictionary<string, string> FullArtRarityToEra = new()
    {
        ["Secret Rare"] = "Sword & Shield",
        ["Amazing Rare"] = "Sword & Shield",
        ["Full Art Trainer"] = "Sword & Shield",
        ["Shiny rare V"] = "Sword & Shield",
        ["Shiny rare VMAX"] = "Sword & Shield",
        ["Illustration rare"] = "Scarlet & Violet",
        ["Special illustration rare"] = "Scarlet & Violet",
        ["Hyper rare"] = "Scarlet & Violet",
        ["Mega Hyper Rare"] = "Scarlet & Violet",
        ["Black White Rare"] = "Scarlet & Violet",
        ["Shiny Ultra Rare"] = "Scarlet & Violet",
    };

    private readonly HttpClient _http;
    private readonly CardCaptorDbContext _dbContext;

    public CardImportService(HttpClient http, CardCaptorDbContext dbContext)
    {
        _http = http;
        _dbContext = dbContext;
    }

    public async Task RunAsync()
    {
        var discovered = new Dictionary<string, string>();

        foreach (var setId in ClassicSetIds)
        {
            Console.WriteLine($"Discovering set {setId}...");
            var set = await _http.GetFromJsonAsync<TcgdexSetResponse>($"sets/{setId}", JsonOptions);

            foreach (var card in set?.Cards ?? new List<TcgdexCardBrief>())
            {
                discovered[card.Id] = "Classic";
            }

            await Task.Delay(75);
        }

        foreach (var (rarity, era) in FullArtRarityToEra)
        {
            Console.WriteLine($"Discovering rarity \"{rarity}\"...");
            var encodedRarity = Uri.EscapeDataString(rarity);
            var briefs = await _http.GetFromJsonAsync<List<TcgdexCardBrief>>($"cards?rarity={encodedRarity}", JsonOptions);

            foreach (var card in briefs ?? new List<TcgdexCardBrief>())
            {
                
                if (!MatchesEra(card.Id, era))
                {
                    continue;
                }

                discovered.TryAdd(card.Id, era);
            }

            await Task.Delay(75);
        }

        var existingSourceIds = _dbContext.Cards.Select(c => c.SourceId).ToHashSet();
        var toImport = discovered.Keys.Where(id => !existingSourceIds.Contains(id)).ToList();

        Console.WriteLine($"Found {discovered.Count} cards total, {toImport.Count} are new. Fetching details...");

        var imported = 0;
        foreach (var sourceId in toImport)
        {
            var detail = await _http.GetFromJsonAsync<TcgdexCardDetail>($"cards/{sourceId}", JsonOptions);
            if (detail == null)
            {
                continue;
            }

            _dbContext.Cards.Add(new Card
            {
                Name = detail.Name,
                ImageUrl = detail.Image != null ? $"{detail.Image}/high.webp" : "",
                Rarity = detail.Rarity ?? "",
                Types = detail.Types != null ? string.Join(",", detail.Types) : "",
                Category = detail.Category ?? "",
                SetName = detail.Set?.Name ?? "",
                Era = discovered[sourceId],
                SourceId = sourceId
            });

            imported++;
            if (imported % 25 == 0)
            {
                await _dbContext.SaveChangesAsync();
                Console.WriteLine($"  ...saved {imported}/{toImport.Count}");
            }

            await Task.Delay(75);
        }

        await _dbContext.SaveChangesAsync();
        Console.WriteLine($"Done. Imported {imported} new cards.");
    }

    private static bool MatchesEra(string sourceId, string era)
    {
        return era switch
        {
            "Sword & Shield" => sourceId.StartsWith("swsh"),
            "Scarlet & Violet" => sourceId.StartsWith("sv") || sourceId.StartsWith("me"),
            _ => true
        };
    }
}

internal class TcgdexSetResponse
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public List<TcgdexCardBrief> Cards { get; set; } = new();
}

internal class TcgdexCardBrief
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
}

internal class TcgdexCardDetail
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string? Image { get; set; }
    public string? Category { get; set; }
    public string? Rarity { get; set; }
    public TcgdexSetBrief? Set { get; set; }
    public List<string>? Types { get; set; }
}

internal class TcgdexSetBrief
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
}
