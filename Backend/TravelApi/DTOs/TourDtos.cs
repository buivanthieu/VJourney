namespace TravelApi.Dtos
{
    public class TourResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string Image { get; set; } = null!;
        public string Duration { get; set; } = null!;
        public decimal Price { get; set; }
        public int LocationId { get; set; }
        public string LocationName { get; set; } = null!;
        public string StartLocation { get; set; } = null!;
        public string Content { get; set; } = null!;
    }

    public class TourCreateDto
    {
        public string Title { get; set; } = null!;
        public string Image { get; set; } = null!;
        public string Duration { get; set; } = "Chưa xác định";
        public decimal Price { get; set; }
        public int LocationId { get; set; }
        public string StartLocation { get; set; } = "Hà Nội";
        public string Content { get; set; } = string.Empty;
    }
}