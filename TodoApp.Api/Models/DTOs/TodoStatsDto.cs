namespace ProjeAdin.Models.DTOs // Klasör yolun neyse o
{
    public class TodoStatsDto
    {
        public int TotalCount { get; set; }
        public int CompletedCount { get; set; }
        public int PendingCount { get; set; }
        public List<int> ChartData { get; set; } = new(); 
    }
}