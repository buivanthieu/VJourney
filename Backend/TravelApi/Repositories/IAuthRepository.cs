using TravelApi.Models;

namespace TravelApi.Repositories
{
    public interface IAuthRepository
    {
        Task<AdminUser?> GetAdminByUsernameAsync(string username);
        Task AddMarketingLeadAsync(MarketingLead lead);
        Task<bool> IsLeadExistsAsync(string email);
        Task SaveChangesAsync();
    }
}
