// Models/Location.cs
using System.ComponentModel.DataAnnotations;

namespace TravelApi.Models
{
    public class Location
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty; 

        [Required]
        [MaxLength(150)]
        public string Slug { get; set; } = string.Empty; // Ví dụ: du-lich-sapa

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty; // Mô tả ngắn phục vụ SEO danh mục


        public ICollection<Tour> Tours { get; set; } = new List<Tour>(); // Quan hệ 1-N với Tour
    }
}