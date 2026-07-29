using System.Text.Json;

namespace CardCaptor.Tests;

// The API serializes with the framework's default camelCase policy, but
// System.Text.Json's client-side deserialization is case-sensitive by
// default, so PascalCase C# record properties need this to bind at all.
public static class TestJson
{
    public static readonly JsonSerializerOptions Options = new()
    {
        PropertyNameCaseInsensitive = true,
    };
}
