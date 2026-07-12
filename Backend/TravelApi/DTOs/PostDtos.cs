namespace TravelApi.Dtos
{
    public class PostResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string Image { get; set; } = null!;
        public string Summary { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public int BlogCategoryId { get; set; } 
        public string BlogCategoryName { get; set; } = null!;
    }

    public class PostCreateDto
    {
        public string Title { get; set; } = null!;
        public string Image { get; set; } = null!; // Nhận link từ Supabase Storage chuyển qua
        public string Summary { get; set; } = null!;
        public string Content { get; set; } = null!;
        public int BlogCategoryId { get; set; }
    }
}