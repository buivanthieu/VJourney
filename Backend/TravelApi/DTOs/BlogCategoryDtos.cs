namespace TravelApi.Dtos
{
    public class BlogCategoryResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
    }

    public class BlogCategoryCreateDto
    {
        public string Name { get; set; } = null!;
    }
}   