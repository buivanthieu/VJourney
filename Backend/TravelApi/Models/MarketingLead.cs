namespace TravelApi.Models
{
    public class MarketingLead
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string? Name { get; set; }
        public string Provider { get; set; } = "Google";
        public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
    }
}
