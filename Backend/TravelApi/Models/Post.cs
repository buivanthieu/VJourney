// Models/Post.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelApi.Models
{
    public class Post
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();  

        [Required]
        [MaxLength(250)]
        public string Title { get; set; } = string.Empty;  

        [Required]
        [MaxLength(250)]
        public string Slug { get; set; } = string.Empty;  

        [Required]
        public string Image { get; set; } = string.Empty;  

        [Required]
        [MaxLength(500)]
        public string Summary { get; set; } = string.Empty; // Mô tả ngắn hiện ở danh sách blog

        [Required]
        [Column(TypeName = "text")] // Ép EF Core cấu hình kiểu TEXT/LONGTEXT trong DB để lưu HTML cực dài
        public string Content { get; set; } = string.Empty; // Chứa mã HTML: <h1>, <h2>, <img>, <iframe>...

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  

        // Khóa ngoại liên kết danh mục blog
        [Required]
        public string BlogCategoryId { get; set; } = string.Empty;  

        [ForeignKey("BlogCategoryId")]
        public BlogCategory? BlogCategory { get; set; }
    }
}