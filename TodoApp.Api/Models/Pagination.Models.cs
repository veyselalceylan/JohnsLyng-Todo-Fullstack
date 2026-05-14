namespace TodoApp.Api.Models;

public class PaginationParams
{
    // Constant to prevent Deep Paging attacks or excessive memory consumption.
    private const int maxPageSize = 50;

    // Default to the first page.
    public int pageNumber { get; set; } = 1;
    
    private int _pageSize = 10;

    // Ensuring the requested page size doesn't exceed the safety limit.
    public int pageSize
    {
        get => _pageSize;
        set => _pageSize = (value > maxPageSize) ? maxPageSize : value;
    }

    // Default sorting property to ensure a consistent initial state.
    public string sortBy { get; set; } = "createdAt";

    // Toggle for descending or ascending order, defaults to newest first.
    public bool isDescending { get; set; } = true; 
}