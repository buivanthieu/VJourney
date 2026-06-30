// Program.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using TravelApi.Data;
using TravelApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. C?u hình EF Core k?t n?i PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. B?T CORS: Cho phép ?ng d?ng Next.js (port 3000) g?i API không b? trình duy?t ch?n
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();


// Program.cs - Thay thế phần API Endpoints cũ của ông bằng đoạn này

// ==================== 1. API QUẢN LÝ LOCATION (ĐỊA ĐIỂM TOUR) ====================
app.MapGet("/api/locations", async (AppDbContext db) =>
    Results.Ok(await db.Locations.OrderBy(l => l.Name).ToListAsync()));

app.MapPost("/api/locations", async (Location loc, AppDbContext db) => {
    if (string.IsNullOrEmpty(loc.Id)) loc.Id = Guid.NewGuid().ToString();
    db.Locations.Add(loc);
    await db.SaveChangesAsync();
    return Results.Created($"/api/locations/{loc.Id}", loc);
});

// ==================== 2. API QUẢN LÝ TOUR (ĐÃ CÓ LOCATION) ====================
// Lấy danh sách tour (Kèm theo thông tin bảng Location để hiển thị tên vùng miền)
app.MapGet("/api/tours", async (AppDbContext db) =>
{
    var tours = await db.Tours.Include(t => t.Location).OrderByDescending(t => t.Id).ToListAsync();
    return Results.Ok(tours);
});

app.MapGet("/api/tours/{slug}", async (string slug, AppDbContext db) =>
{
    var tour = await db.Tours.Include(t => t.Location).FirstOrDefaultAsync(t => t.Slug == slug);
    return tour is not null ? Results.Ok(tour) : Results.NotFound();
});

app.MapPost("/api/tours", async (Tour tour, AppDbContext db) =>
{
if (string.IsNullOrEmpty(tour.Id)) tour.Id = Guid.NewGuid().ToString();  
    db.Tours.Add(tour);
await db.SaveChangesAsync();
return Results.Created($"/api/tours/{tour.Slug}", tour);  
});

// ==================== 3. API QUẢN LÝ DANH MỤC BLOG ====================
app.MapGet("/api/blog-categories", async (AppDbContext db) =>
    Results.Ok(await db.BlogCategories.OrderBy(c => c.Name).ToListAsync()));  

app.MapPost("/api/blog-categories", async (BlogCategory cat, AppDbContext db) => {
if (string.IsNullOrEmpty(cat.Id)) cat.Id = Guid.NewGuid().ToString();
db.BlogCategories.Add(cat);
await db.SaveChangesAsync();
return Results.Created($"/api/blog-categories/{cat.Id}", cat);  
});

// ==================== 4. API QUẢN LÝ BÀI VIẾT BLOG / CẨM NANG ====================
// Lấy tất cả bài viết phục vụ trang cẩm nang du lịch
app.MapGet("/api/posts", async (AppDbContext db) => {
    var posts = await db.Posts.Include(p => p.BlogCategory).OrderByDescending(p => p.CreatedAt).ToListAsync();
    return Results.Ok(posts);
});  

// Lấy chi tiết bài blog theo slug (Bốc nguyên đoạn mã HTML Content ra để render)
app.MapGet("/api/posts/{slug}", async (string slug, AppDbContext db) => {
    var post = await db.Posts.Include(p => p.BlogCategory).FirstOrDefaultAsync(p => p.Slug == slug);
    return post is not null ? Results.Ok(post) : Results.NotFound();
});  

// Lưu bài viết chứa mã HTML từ trang quản trị xuống DB
app.MapPost("/api/posts", async (Post post, AppDbContext db) => {
if (string.IsNullOrEmpty(post.Id)) post.Id = Guid.NewGuid().ToString();
post.CreatedAt = DateTime.UtcNow;  
    db.Posts.Add(post);
await db.SaveChangesAsync();
return Results.Created($"/api/posts/{post.Slug}", post);  
});

// T? ??ng kh?i t?o database n?u ch?a có khi ?ng d?ng ch?y lên
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors("AllowNextJS");

//app.UseHttpsRedirection();



app.Run();