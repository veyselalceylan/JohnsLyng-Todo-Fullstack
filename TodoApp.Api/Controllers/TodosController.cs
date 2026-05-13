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

    public TodosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [HttpGet]
    public async Task<IActionResult> GetTodos([FromQuery] PaginationParams @params)
    {
        var query = _context.Todos.AsQueryable();

        // @params içindeki property isimlerini küçük harfle çağırıyoruz
        query = @params.sortBy?.ToLower() switch
        {
            "title" => @params.isDescending ? query.OrderByDescending(t => t.title) : query.OrderBy(t => t.title),
            "iscompleted" => @params.isDescending ? query.OrderByDescending(t => t.isCompleted) : query.OrderBy(t => t.isCompleted),
            "deadline" => @params.isDescending ? query.OrderByDescending(t => t.deadline) : query.OrderBy(t => t.deadline),
            "priority" => @params.isDescending ? query.OrderByDescending(t => t.priority) : query.OrderBy(t => t.priority),
            _ => @params.isDescending ? query.OrderByDescending(t => t.createdAt) : query.OrderBy(t => t.createdAt)
        };

        var totalItems = await query.CountAsync();

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
        var start = startDate ?? DateTime.UtcNow.AddDays(-7);
        var end = endDate ?? DateTime.UtcNow;

        var todos = await _context.Todos
            .Where(t => t.CreatedAt >= start && t.CreatedAt <= end)
            .ToListAsync();

        var stats = new TodoStatsDto
        {
            TotalCount = todos.Count,
            CompletedCount = todos.Count(t => t.IsCompleted),
            PendingCount = todos.Count(t => !t.IsCompleted),
            ChartData = new List<int> {
            todos.Count(t => t.IsCompleted),
            todos.Count(t => !t.IsCompleted)
        }
        };

        return Ok(stats);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Todo>> GetTodoById(Guid id)
    {
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
        todo.id = Guid.NewGuid();
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTodoById), new { id = todo.id }, todo);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTodo(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null) return NotFound();

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> BulkDelete([FromBody] List<string> ids)
    {
        if (ids == null || !ids.Any()) return BadRequest("No IDs provided.");

        var guidIds = ids.Select(Guid.Parse).ToList();
        var todosToDelete = await _context.Todos
            .Where(t => guidIds.Contains(t.id))
            .ToListAsync();

        if (!todosToDelete.Any()) return NotFound();

        _context.Todos.RemoveRange(todosToDelete);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"{todosToDelete.Count} tasks deleted successfully." });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Todo>> UpdateTodo(Guid id, Todo todo)
    {
        var existingTodo = await _context.Todos.FindAsync(id);
        if (existingTodo == null) return NotFound();

        todo.id = id;

        var entry = _context.Entry(existingTodo);
        entry.CurrentValues.SetValues(todo);

        // Burası artık küçük harf:
        entry.Property(x => x.id).IsModified = false;
        entry.Property(x => x.createdAt).IsModified = false; // 'c' küçük oldu

        existingTodo.updatedAt = DateTime.UtcNow; // 'u' küçük oldu

        await _context.SaveChangesAsync();
        return Ok(existingTodo);
    }
}