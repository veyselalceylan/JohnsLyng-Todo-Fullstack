using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Models;
using TodoApp.Api.Models.DTOs;

namespace TodoApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly AppDbContext _context;

    // Dependency Injection: Decoupling context management from the controller for better testability.
    public TodosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTodos([FromQuery] PaginationParams @params)
    {
        // Using IQueryable to ensure that filtering and sorting happen at the Database level (deferred execution).
        var query = _context.Todos.AsQueryable();

        // Server-side sorting: Efficiently handles large datasets by only fetching required order.
        query = @params.sortBy?.ToLower() switch
        {
            "title" => @params.isDescending ? query.OrderByDescending(t => t.title) : query.OrderBy(t => t.title),
            "iscompleted" => @params.isDescending ? query.OrderByDescending(t => t.isCompleted) : query.OrderBy(t => t.isCompleted),
            "deadline" => @params.isDescending ? query.OrderByDescending(t => t.deadline) : query.OrderBy(t => t.deadline),
            "priority" => @params.isDescending ? query.OrderByDescending(t => t.priority) : query.OrderBy(t => t.priority),
            _ => @params.isDescending ? query.OrderByDescending(t => t.createdAt) : query.OrderBy(t => t.createdAt)
        };

        var totalItems = await query.CountAsync();

        // Pagination: Skip/Take pattern implemented to optimize memory usage on the API and client.
        var items = await query
            .Skip((@params.pageNumber - 1) * @params.pageSize)
            .Take(@params.pageSize)
            .ToListAsync();

        return Ok(new
        {
            totalCount = totalItems,
            pageSize = @params.pageSize,
            pageNumber = @params.pageNumber,
            totalPages = (int)Math.Ceiling(totalItems / (double)@params.pageSize),
            items = items
        });
    }

    [HttpGet("stats")]
    public async Task<ActionResult<TodoStatsDto>> GetTodoStats([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var start = startDate ?? DateTime.UtcNow;
        var end = endDate ?? DateTime.UtcNow.AddDays(7);

        // Filtering by range: Standard practice for dashboard analytics.
        var todos = await _context.Todos
            .Where(t => t.deadline >= start && t.deadline <= end) 
            .ToListAsync();

        var stats = new TodoStatsDto
        {
            TotalCount = todos.Count,
            CompletedCount = todos.Count(t => t.isCompleted),
            PendingCount = todos.Count(t => !t.isCompleted),
            ChartData = new List<int> {
                todos.Count(t => t.isCompleted),
                todos.Count(t => !t.isCompleted)
            }
        };

        return Ok(stats);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Todo>> GetTodoById(Guid id)
    {
        // Using FindAsync for optimized primary key lookups.
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null)
        {
            return NotFound(new { message = $"{id} todo doesnt exist" });
        }
        return Ok(todo);
    }

    [HttpPost]
    public async Task<ActionResult<Todo>> CreateTodo(Todo todo)
    {
        // Manual ID assignment to ensure Guid consistency across environments.
        todo.id = Guid.NewGuid();
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        // Following REST standards by returning a 201 Created status with the location header.
        return CreatedAtAction(nameof(GetTodoById), new { id = todo.id }, todo);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTodo(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null) return NotFound();

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();
        return NoContent(); // 204 NoContent is the standard for successful DELETE operations.
    }

    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> BulkDelete([FromBody] List<string> ids)
    {
        if (ids == null || !ids.Any()) return BadRequest("No IDs provided.");

        // Validating and parsing Guids for safe database operations.
        var guidIds = ids.Select(Guid.Parse).ToList();
        var todosToDelete = await _context.Todos
            .Where(t => guidIds.Contains(t.id))
            .ToListAsync();

        if (!todosToDelete.Any()) return NotFound();

        // Using RemoveRange for batch deletion to minimize database roundtrips.
        _context.Todos.RemoveRange(todosToDelete);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"{todosToDelete.Count} tasks deleted successfully." });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Todo>> UpdateTodo(Guid id, Todo todo)
    {
        var existingTodo = await _context.Todos.FindAsync(id);
        if (existingTodo == null) return NotFound();

        // Identity Safety: Explicitly preventing the modification of sensitive properties.
        todo.id = id;
        var entry = _context.Entry(existingTodo);
        
        // Efficient Update: Mapping current values without reloading the entire object graph.
        entry.CurrentValues.SetValues(todo);
        
        // Audit Tracking: Ensuring system-generated fields remain immutable during updates.
        entry.Property(x => x.id).IsModified = false;
        entry.Property(x => x.createdAt).IsModified = false;
        
        existingTodo.updatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(existingTodo);
    }
}