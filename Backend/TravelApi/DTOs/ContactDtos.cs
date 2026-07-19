// Dtos/ContactCreateDto.cs
namespace TravelApi.Dtos
{
    public class ContactCreateDto
    {
        public string Name { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string? Email { get; set; }
        public string? Message { get; set; }
    }
}