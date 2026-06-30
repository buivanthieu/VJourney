// Models/BlogCategory.cs
using System.ComponentModel.DataAnnotations;

namespace TravelApi.Models
{
    public class BlogCategory
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();  

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;  

        [Required]
        [MaxLength(150)]
        public string Slug { get; set; } = string.Empty;  
    }
}