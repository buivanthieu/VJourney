using TravelApi.Dtos;

namespace TravelApi.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAdminAsync(AdminLoginDto dto);
        Task<bool> RegisterMarketingLeadAsync(MarketingLeadCreateDto dto);
    }
}