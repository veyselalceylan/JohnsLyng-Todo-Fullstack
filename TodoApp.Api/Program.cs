using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// CORS Configuration: Essential for allowing the Frontend (Angular) to communicate with the API.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200","http://127.0.0.1:4200") 
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        // ExposedHeaders: Allows the client to read custom headers (like pagination metadata).
                        .WithExposedHeaders("X-Total-Count"));
});

// Dependency Injection: Registering the DbContext with an In-Memory Database for rapid prototyping and testing.
builder.Services.AddDbContext<AppDbContext>(opt => 
    opt.UseInMemoryDatabase("TodoList"));

// Swagger/OpenAPI: Automatically generates API documentation for easier testing during development.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline (Middleware).
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// Routing must be defined before CORS and MapControllers.
app.UseRouting();

// CORS Middleware: Applied globally to the application.
app.UseCors("AllowAngular");


// Attribute Routing: Maps controller actions to their respective routes.
app.MapControllers(); 

app.Run();