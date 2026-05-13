namespace TodoApp.Api.Models;

public class Todo
{
    public Guid id { get; set; } 
    public string title { get; set; } = string.Empty;
    public string? description { get; set; }
    public bool isCompleted { get; set; }
    
    public DateTime createdAt { get; set; } = DateTime.UtcNow;
    public DateTime? updatedAt { get; set; } 
    public DateTime? deadline { get; set; } 
    
    public string priority { get; set; } = "Medium"; 
}