// Models/Location.cs
using System.ComponentModel.DataAnnotations;

namespace TravelApi.Models
{
    public class Location
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty; // Ví dụ: Sapa, Hà Giang

        [Required]
        [MaxLength(150)]
        public string Slug { get; set; } = string.Empty; // Ví dụ: du-lich-sapa

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty; // Mô tả ngắn phục vụ SEO danh mục
    }
}