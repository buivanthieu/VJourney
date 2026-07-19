namespace TravelApi.Dtos
{
    public class AdminLoginDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = null!;
        public string Username { get; set; } = null!;
    }
}