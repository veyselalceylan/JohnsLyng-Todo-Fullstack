using Microsoft.AspNetCore.Mvc;
using TodoApp.Api.Data;
using TodoApp.Api.Models;
using Microsoft.EntityFrameworkCore;

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

        query = @params.SortBy?.ToLower() switch
        {
            "title" => @params.IsDescending ? query.OrderByDescending(t => t.Title) : query.OrderBy(t => t.Title),
            "iscompleted" => @params.IsDescending ? query.OrderByDescending(t => t.IsCompleted) : query.OrderBy(t => t.IsCompleted),
            "deadline" => @params.IsDescending ? query.OrderByDescending(t => t.Deadline) : query.OrderBy(t => t.Deadline),
            "priority" => @params.IsDescending ? query.OrderByDescending(t => t.Priority) : query.OrderBy(t => t.Priority),
            _ => @params.IsDescending ? query.OrderByDescending(t => t.CreatedAt) : query.OrderBy(t => t.CreatedAt)
        };

        var orderedQuery = query is IOrderedQueryable<Todo> oq
            ? oq.ThenBy(t => t.Id)
            : query.OrderBy(t => t.Id);

        var totalItems = await orderedQuery.CountAsync();

        var items = await orderedQuery
            .Skip((@params.PageNumber - 1) * @params.PageSize)
            .Take(@params.PageSize)
            .ToListAsync();

        return Ok(new
        {
            TotalCount = totalItems,
            @params.PageSize,
            @params.PageNumber,
            TotalPages = (int)Math.Ceiling(totalItems / (double)@params.PageSize),
            Items = items
        });
    }
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Todo>> GetTodoById(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null)
        {
            return NotFound(new { Message = $"{id} todo doesnt exist" });
        }
        return Ok(todo);
    }
    [HttpPost]
    public async Task<ActionResult<Todo>> CreateTodo(Todo todo)
    {
        todo.Id = Guid.NewGuid();
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTodos), new { id = todo.Id }, todo);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null)
        {
            return NotFound();
        }
        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Todo>> UpdateTodo(Guid id, Todo todo)
    {
        var existingTodo = await _context.Todos.FindAsync(id);
        if (existingTodo == null) return NotFound();

        // Backend modeline sadık kalarak tüm değerleri tek seferde günceller
        _context.Entry(existingTodo).CurrentValues.SetValues(todo);

        // Sadece manuel kontrol etmek istediğin alanları ezersin
        existingTodo.UpdatedAt = DateTime.UtcNow;
        existingTodo.Id = id; // Güvenlik için ID'nin değişmediğinden emin olalım

        await _context.SaveChangesAsync();
        return Ok(existingTodo);
    }
}