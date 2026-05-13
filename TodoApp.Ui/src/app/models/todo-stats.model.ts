export interface TodoStatsDto {
  totalCount: number;
  completedCount: number;
  pendingCount: number;
  chartData: number[]; // C#'taki List<int> burada number[] olur
}