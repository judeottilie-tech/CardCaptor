namespace CardCaptor.Models.DTOs;

public class CreateBinderPageDTO
{
    public string Title { get; set; }
    public string? Description { get; set; }
    public int Rows { get; set; } = 3;
    public int Columns { get; set; } = 3;
    public bool IsPublic { get; set; } = false;
};
