// Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using TravelApi.Dtos;
using TravelApi.Services;

namespace TravelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;
        public AuthController(IAuthService service) => _service = service;

        [HttpPost("admin/login")] // API Admin đăng nhập lấy mã JWT thật
        public async Task<IActionResult> Login([FromBody] AdminLoginDto dto)
        {
            var result = await _service.LoginAdminAsync(dto);
            if (result == null) return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu Quản trị viên!" });
            return Ok(result);
        }

        [HttpPost("google/callback")] // API hứng Gmail từ nút Google Auth bên Next.js chuyển sang
        public async Task<IActionResult> GoogleCallback([FromBody] MarketingLeadCreateDto dto)
        {
            var isNew = await _service.RegisterMarketingLeadAsync(dto);
            return Ok(new { success = true, isNewLead = isNew, message = "Đã đồng bộ Email Marketing thành công!" });
        }
    }
}