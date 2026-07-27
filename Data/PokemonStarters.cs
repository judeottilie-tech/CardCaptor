namespace CardCaptor.Data;

public record PokemonLine(string Stage1, string Stage2, string Stage3);

// Static reference data: the 27 starter lines a user can pick from at registration,
// each with its 2 evolutions. Feed-count thresholds control when the pet evolves.
public static class PokemonStarters
{
    public const int Stage2FeedThreshold = 10;
    public const int Stage3FeedThreshold = 25;

    public static readonly List<PokemonLine> Lines = new()
    {
        new("Bulbasaur", "Ivysaur", "Venusaur"),
        new("Charmander", "Charmeleon", "Charizard"),
        new("Squirtle", "Wartortle", "Blastoise"),
        new("Chikorita", "Bayleef", "Meganium"),
        new("Cyndaquil", "Quilava", "Typhlosion"),
        new("Totodile", "Croconaw", "Feraligatr"),
        new("Treecko", "Grovyle", "Sceptile"),
        new("Torchic", "Combusken", "Blaziken"),
        new("Mudkip", "Marshtomp", "Swampert"),
        new("Turtwig", "Grotle", "Torterra"),
        new("Chimchar", "Monferno", "Infernape"),
        new("Piplup", "Prinplup", "Empoleon"),
        new("Snivy", "Servine", "Serperior"),
        new("Tepig", "Pignite", "Emboar"),
        new("Oshawott", "Dewott", "Samurott"),
        new("Chespin", "Quilladin", "Chesnaught"),
        new("Fennekin", "Braixen", "Delphox"),
        new("Froakie", "Frogadier", "Greninja"),
        new("Rowlet", "Dartrix", "Decidueye"),
        new("Litten", "Torracat", "Incineroar"),
        new("Popplio", "Brionne", "Primarina"),
        new("Grookey", "Thwackey", "Rillaboom"),
        new("Scorbunny", "Raboot", "Cinderace"),
        new("Sobble", "Drizzile", "Inteleon"),
        new("Sprigatito", "Floragato", "Meowscarada"),
        new("Fuecoco", "Crocalor", "Skeledirge"),
        new("Quaxly", "Quaxwell", "Quaquaval"),
    };

    public static bool IsValidStarter(string name) =>
        Lines.Any(l => l.Stage1.Equals(name, StringComparison.OrdinalIgnoreCase));

    public static PokemonLine? FindLine(string starterName) =>
        Lines.FirstOrDefault(l => l.Stage1.Equals(starterName, StringComparison.OrdinalIgnoreCase));

    public static string GetCurrentStagePokemon(string starterName, int feedCount)
    {
        var line = FindLine(starterName);
        if (line == null) return starterName;

        if (feedCount >= Stage3FeedThreshold) return line.Stage3;
        if (feedCount >= Stage2FeedThreshold) return line.Stage2;
        return line.Stage1;
    }

    public static int GetStage(int feedCount)
    {
        if (feedCount >= Stage3FeedThreshold) return 3;
        if (feedCount >= Stage2FeedThreshold) return 2;
        return 1;
    }
}
