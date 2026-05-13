namespace TodoApp.Api.Models;

public class PaginationParams
{
    private const int maxPageSize = 50;
    
    // Angular'daki isimlendirmelerle birebir aynı (camelCase)
    public int pageNumber { get; set; } = 1;
    
    private int _pageSize = 10;
    public int pageSize
    {
        get => _pageSize;
        set => _pageSize = (value > maxPageSize) ? maxPageSize : value;
    }

    public string sortBy { get; set; } = "createdAt";
    public bool isDescending { get; set; } = true; 
}