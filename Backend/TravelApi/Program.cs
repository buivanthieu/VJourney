using Microsoft.EntityFrameworkCore;
using TravelApi.Datas;
using TravelApi.Repositories;
using TravelApi.Services;

var builder = WebApplication.CreateBuilder(args);
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://*:{port}");
// 1. Đăng ký Controllers và Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. Cấu hình Database Context kết nối tới Postgres
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Đăng ký Dependency Injection cho tầng Repository & Toàn bộ Services
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IAuthRepository, AuthRepository>();

builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITourService, TourService>();
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<IBlogCategoryService, BlogCategoryService>();
builder.Services.AddScoped<IPostService, PostService>();

// 4. BẮT BUỘC: Cấu hình CORS để Next.js (Port 3000) gọi được API C# (Port 5000 hoặc tùy máy bro)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJsFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://v-journey-nu.vercel.app"
            )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// Kích hoạt CORS trước khi map định tuyến
app.UseCors("AllowNextJsFrontend");



app.UseAuthorization();

// Ánh xạ các API Controller
app.MapControllers();

app.Run();