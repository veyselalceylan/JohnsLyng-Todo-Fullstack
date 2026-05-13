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
    public async Task<ActionResult<IEnumerable<Todo>>> GetTodos()
    {
        return await _context.Todos.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Todo>> CreateTodo(Todo todo)
    {
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
        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();
        return NoContent();
    }

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
    }
}