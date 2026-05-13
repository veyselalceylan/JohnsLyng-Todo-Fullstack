namespace TodoApp.Api.Models;

public class Todo
{
<<<<<<< HEAD
    public Guid id { get; set; } 
    public string title { get; set; } = string.Empty;
    public string? description { get; set; }
    public bool isCompleted { get; set; }
    
    public DateTime createdAt { get; set; } = DateTime.UtcNow;
    public DateTime? updatedAt { get; set; } 
    public DateTime? deadline { get; set; } 
    
    public string priority { get; set; } = "Medium"; 
=======
    public Guid Id { get; set; } 
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; } 
    public string Priority { get; set; } = "Medium"; 
>>>>>>> origin/feature/backend-todo-controller
}