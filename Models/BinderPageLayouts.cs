namespace CardCaptor.Models;

public static class BinderPageLayouts
{
    public static readonly (int Rows, int Columns)[] Allowed =
    {
        (2, 2),
        (3, 3),
        (3, 4),
        (4, 4),
    };

    public static bool IsValid(int rows, int columns) =>
        Array.Exists(Allowed, layout => layout.Rows == rows && layout.Columns == columns);
}
