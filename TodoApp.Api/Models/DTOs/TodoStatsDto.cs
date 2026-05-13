namespace TodoApp.Api.Models.DTOs 
{
    public class TodoStatsDto
    {
        public int TotalCount { get; set; }
        public int CompletedCount { get; set; }
        public int PendingCount { get; set; }
        public List<int> ChartData { get; set; } = new(); 
    }
}