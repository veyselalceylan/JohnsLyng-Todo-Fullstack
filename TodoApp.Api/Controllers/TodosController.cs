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

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodo(Guid id, Todo todo)
    {
        if (id != todo.Id)
        {
            return BadRequest("ID mismatch");
        }
        _context.Entry(todo).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Todos.Any(e => e.Id == id))
            {
                return NotFound();
            }
            throw;
        }
        return NoContent();
    }
}