using Microsoft.AspNetCore.Mvc;
<<<<<<< HEAD
using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Models;
using TodoApp.Api.Models.DTOs;

=======
using TodoApp.Api.Data;
using TodoApp.Api.Models;
using Microsoft.EntityFrameworkCore;
>>>>>>> origin/feature/backend-todo-controller

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

<<<<<<< HEAD
    [HttpGet]
    public async Task<IActionResult> GetTodos([FromQuery] PaginationParams @params)
    {
        var query = _context.Todos.AsQueryable();

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
        var start = startDate ?? DateTime.UtcNow;
        var end = endDate ?? DateTime.UtcNow.AddDays(7);

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
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null)
        {
            return NotFound(new { message = $"{id} todo doesnt exist" });
        }
        return Ok(todo);
=======
   [HttpGet]
    public async Task<ActionResult<IEnumerable<Todo>>> GetTodos()
    {
        return await _context.Todos.ToListAsync();
>>>>>>> origin/feature/backend-todo-controller
    }

    [HttpPost]
    public async Task<ActionResult<Todo>> CreateTodo(Todo todo)
    {
<<<<<<< HEAD
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

=======
        todo.Id = Guid.NewGuid();
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTodos), new { id = todo.Id}, todo);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if(todo == null)
        {
            return NotFound();
        }
>>>>>>> origin/feature/backend-todo-controller
        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();
        return NoContent();
    }

<<<<<<< HEAD
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
        entry.Property(x => x.id).IsModified = false;
        entry.Property(x => x.createdAt).IsModified = false;
        existingTodo.updatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(existingTodo);
=======
    [HttpPut("{id}")]
    public async Task<IActionResult>UpdateTodo(Guid id, Todo todo)
    {
        if(id != todo.Id)
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
            if(!_context.Todos.Any(e => e.Id == id))
            {
                return NotFound();
            }
            throw;
        }
        return NoContent();
>>>>>>> origin/feature/backend-todo-controller
    }
}