
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TravelApi.Dtos;
using TravelApi.Models;
using TravelApi.Repositories;

namespace TravelApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;

        public AuthService(IAuthRepository repo, IConfiguration config)
        {
            _repo = repo;
            _config = config;
        }

        public async Task<AuthResponseDto?> LoginAdminAsync(AdminLoginDto dto)
        {
            var admin = await _repo.GetAdminByUsernameAsync(dto.Username);
            if (admin == null) return null;

            // Kiểm tra mật mã (Ở đây tạm thời so sánh text thô, khuyên ông nên dùng BCrypt mã hóa nhé)
            if (admin.PasswordHash != dto.Password) return null;

            // LẬP LUẬN VÀ SINH TOKEN JWT CHUẨN MÃ HÓA DOANH NGHIỆP
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "Chuoi_Bi_Mat_Sieu_Cap_Vjourney_2026");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.Name, admin.Username),
                    new Claim(ClaimTypes.Role, "Admin")
                }),
                Expires = DateTime.UtcNow.AddDays(1), // Token có giá trị trong 24 giờ
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new AuthResponseDto
            {
                Token = tokenHandler.WriteToken(token),
                Username = admin.Username
            };
        }

        public async Task<bool> RegisterMarketingLeadAsync(MarketingLeadCreateDto dto)
        {
            if (await _repo.IsLeadExistsAsync(dto.Email)) return false;

            var lead = new MarketingLead { Email = dto.Email, Name = dto.Name, Provider = dto.Provider };
            await _repo.AddMarketingLeadAsync(lead);
            await _repo.SaveChangesAsync();
            return true;
        }
    }
}