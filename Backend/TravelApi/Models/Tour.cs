// Models/Tour.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TravelApi.Models
{
    public class Tour
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(250)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(250)]
        public string Slug { get; set; } = string.Empty;

        [Required]
        public string Image { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Duration { get; set; } = "Chưa xác định";

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int LocationId { get; set; }

        [ForeignKey("LocationId")]
        public Location? Location { get; set; }

        [Required]
        [MaxLength(100)]
        public string StartLocation { get; set; } = "Hà Nội";

        // NÂNG CẤP THẦN THÁNH Ở ĐÂY: Lưu trọn vẹn lịch trình chi tiết, bảng biểu, ảnh thực tế dưới dạng HTML
        [Required]
        [Column(TypeName = "text")]
        public string Content { get; set; } = string.Empty;
    }
}