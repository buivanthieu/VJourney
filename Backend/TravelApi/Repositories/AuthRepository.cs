using Microsoft.EntityFrameworkCore;
using TravelApi.Datas;
using TravelApi.Models;

namespace TravelApi.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _context;
        public AuthRepository(AppDbContext context) => _context = context;

        public async Task<AdminUser?> GetAdminByUsernameAsync(string username) =>
            await _context.Set<AdminUser>().FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());

        public async Task AddMarketingLeadAsync(MarketingLead lead) => await _context.MarketingLeads.AddAsync(lead);

        public async Task<bool> IsLeadExistsAsync(string email) =>
            await _context.MarketingLeads.AnyAsync(l => l.Email.ToLower() == email.ToLower());

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}