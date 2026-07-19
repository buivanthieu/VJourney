namespace TravelApi.Dtos
{
    public class MarketingLeadCreateDto
    {
        public string Email { get; set; } = null!;
        public string? Name { get; set; }
        public string Provider { get; set; } = "Google";
    }
}
