// Models/BlogCategory.cs
using System.ComponentModel.DataAnnotations;

namespace TravelApi.Models
{
    public class BlogCategory
    {
        [Key]
        public int Id { get; set; }  

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;  

        [Required]
        [MaxLength(150)]
        public string Slug { get; set; } = string.Empty;  

        public ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}