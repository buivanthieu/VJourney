namespace TravelApi.Dtos
{
    public class LocationResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string Description { get; set; } = null!;
    }

    public class LocationCreateDto
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
    }
}