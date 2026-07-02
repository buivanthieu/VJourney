// Program.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using TravelApi.Data;
using TravelApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình EF Core kết nối PostgreSQL 
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");  
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));  

// 2. BẬT CORS: Cho phép ứng dụng Next.js gọi API không bị chặn 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS", policy =>
    {
    policy.WithOrigins("http://localhost:3000")
          .AllowAnyHeader()
          .AllowAnyMethod();  
    });
});

// NÂNG CẤP: Thêm dịch vụ tạo tài liệu Swagger UI tự động để test API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Kích hoạt Swagger UI khi ứng dụng chạy ở môi trường Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ==================== 1. API QUẢN LÝ LOCATION (ĐỊA ĐIỂM TOUR) ====================
// [GET] Lấy danh sách địa điểm 
app.MapGet("/api/locations", async (AppDbContext db) =>
    Results.Ok(await db.Locations.OrderBy(l => l.Name).ToListAsync()));  

// [POST] Thêm địa điểm mới 
app.MapPost("/api/locations", async (Location loc, AppDbContext db) => {
if (string.IsNullOrEmpty(loc.Id)) loc.Id = Guid.NewGuid().ToString();  
    db.Locations.Add(loc);  
await db.SaveChangesAsync();  
return Results.Created($"/api/locations/{loc.Id}", loc);  
});

// [PUT] Cập nhật thông tin địa điểm (BỔ SUNG)
app.MapPut("/api/locations/{id}", async (string id, Location updatedLoc, AppDbContext db) => {
    var loc = await db.Locations.FindAsync(id);
    if (loc is null) return Results.NotFound("Không tìm thấy địa điểm yêu cầu.");

    loc.Name = updatedLoc.Name;
    loc.Slug = updatedLoc.Slug;
    loc.Description = updatedLoc.Description;

    await db.SaveChangesAsync();
    return Results.Ok(loc);
});

// [DELETE] Xóa địa điểm (BỔ SUNG)
app.MapDelete("/api/locations/{id}", async (string id, AppDbContext db) => {
    var loc = await db.Locations.FindAsync(id);
    if (loc is null) return Results.NotFound("Không tìm thấy địa điểm cần xóa.");

    db.Locations.Remove(loc);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Xóa địa điểm thành công!" });
});


// ==================== 2. API QUẢN LÝ TOUR ====================
// [GET] Lấy danh sách tour kèm theo Location 
app.MapGet("/api/tours", async (AppDbContext db) =>
{
var tours = await db.Tours.Include(t => t.Location).OrderByDescending(t => t.Id).ToListAsync();  
    return Results.Ok(tours);  
});

// [GET BY SLUG] Xem chi tiết một tour 
app.MapGet("/api/tours/{slug}", async (string slug, AppDbContext db) =>
{
var tour = await db.Tours.Include(t => t.Location).FirstOrDefaultAsync(t => t.Slug == slug);  
    return tour is not null ? Results.Ok(tour) : Results.NotFound();  
});

// [POST] Thêm tour mới 
app.MapPost("/api/tours", async (Tour tour, AppDbContext db) =>
{
if (string.IsNullOrEmpty(tour.Id)) tour.Id = Guid.NewGuid().ToString();  
    db.Tours.Add(tour);  
await db.SaveChangesAsync();  
return Results.Created($"/api/tours/{tour.Slug}", tour);  
});

// [PUT] Cập nhật chương trình Tour (BỔ SUNG)
app.MapPut("/api/tours/{id}", async (string id, Tour updatedTour, AppDbContext db) => {
    var tour = await db.Tours.FindAsync(id);
    if (tour is null) return Results.NotFound("Không tìm thấy chương trình tour cần sửa.");

    tour.Title = updatedTour.Title;
    tour.Slug = updatedTour.Slug;
    tour.Image = updatedTour.Image;
    tour.Duration = updatedTour.Duration;
    tour.Price = updatedTour.Price;
    tour.LocationId = updatedTour.LocationId;
    tour.StartLocation = updatedTour.StartLocation;
    tour.Content = updatedTour.Content; // Nhận chuỗi HTML đã cập nhật từ bộ gõ

    await db.SaveChangesAsync();
    return Results.Ok(tour);
});

// [DELETE] Xóa bỏ chương trình Tour (BỔ SUNG)
app.MapDelete("/api/tours/{id}", async (string id, AppDbContext db) => {
    var tour = await db.Tours.FindAsync(id);
    if (tour is null) return Results.NotFound("Không tìm thấy tour cần xóa.");

    db.Tours.Remove(tour);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Đã xóa tour thành công khỏi cơ sở dữ liệu." });
});


// ==================== 3. API QUẢN LÝ DANH MỤC BLOG ====================
// [GET] Lấy danh sách danh mục bài viết 
app.MapGet("/api/blog-categories", async (AppDbContext db) =>
    Results.Ok(await db.BlogCategories.OrderBy(c => c.Name).ToListAsync()));  

// [POST] Tạo danh mục bài viết 
app.MapPost("/api/blog-categories", async (BlogCategory cat, AppDbContext db) => {
if (string.IsNullOrEmpty(cat.Id)) cat.Id = Guid.NewGuid().ToString();  
    db.BlogCategories.Add(cat);  
await db.SaveChangesAsync();  
return Results.Created($"/api/blog-categories/{cat.Id}", cat);  
});

// [PUT] Sửa đổi danh mục blog (BỔ SUNG)
app.MapPut("/api/blog-categories/{id}", async (string id, BlogCategory updatedCat, AppDbContext db) => {
    var cat = await db.BlogCategories.FindAsync(id);
    if (cat is null) return Results.NotFound("Danh mục bài viết không tồn tại.");

    cat.Name = updatedCat.Name;
    cat.Slug = updatedCat.Slug;

    await db.SaveChangesAsync();
    return Results.Ok(cat);
});

// [DELETE] Xóa danh mục bài viết (BỔ SUNG)
app.MapDelete("/api/blog-categories/{id}", async (string id, AppDbContext db) => {
    var cat = await db.BlogCategories.FindAsync(id);
    if (cat is null) return Results.NotFound("Không tìm thấy danh mục cần xóa.");

    db.BlogCategories.Remove(cat);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Xóa danh mục thành công!" });
});


// ==================== 4. API QUẢN LÝ BÀI VIẾT BLOG / CẨM NANG ====================
// [GET] Lấy tất cả bài viết 
app.MapGet("/api/posts", async (AppDbContext db) => {
    var posts = await db.Posts.Include(p => p.BlogCategory).OrderByDescending(p => p.CreatedAt).ToListAsync();  
    return Results.Ok(posts);  
});

// [GET BY SLUG] Lấy chi tiết bài viết 
app.MapGet("/api/posts/{slug}", async (string slug, AppDbContext db) => {
var post = await db.Posts.Include(p => p.BlogCategory).FirstOrDefaultAsync(p => p.Slug == slug);  
    return post is not null ? Results.Ok(post) : Results.NotFound();  
});

// [POST] Đăng bài viết mới 
app.MapPost("/api/posts", async (Post post, AppDbContext db) => {
    if (string.IsNullOrEmpty(post.Id)) post.Id = Guid.NewGuid().ToString();  
    post.CreatedAt = DateTime.UtcNow;  
db.Posts.Add(post);  
await db.SaveChangesAsync();  
return Results.Created($"/api/posts/{post.Slug}", post);  
});

// [PUT] Sửa đổi nội dung bài viết HTML (BỔ SUNG)
app.MapPut("/api/posts/{id}", async (string id, Post updatedPost, AppDbContext db) => {
    var post = await db.Posts.FindAsync(id);
    if (post is null) return Results.NotFound("Bài viết không tồn tại trên hệ thống.");

    post.Title = updatedPost.Title;
    post.Slug = updatedPost.Slug;
    post.Image = updatedPost.Image;
    post.Summary = updatedPost.Summary;
    post.Content = updatedPost.Content; // Cập nhật nội dung HTML bài blog mới
    post.BlogCategoryId = updatedPost.BlogCategoryId;

    await db.SaveChangesAsync();
    return Results.Ok(post);
});

// [DELETE] Xóa bỏ bài viết (BỔ SUNG)
app.MapDelete("/api/posts/{id}", async (string id, AppDbContext db) => {
    var post = await db.Posts.FindAsync(id);
    if (post is null) return Results.NotFound("Không tìm thấy bài viết cần xóa.");

    db.Posts.Remove(post);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Đã xóa bài viết cẩm nang thành công!" });
});


// Tự động khởi tạo database nếu chưa có khi ứng dụng chạy lên 
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();  
    db.Database.EnsureCreated();  
}

app.UseCors("AllowNextJS");  

app.Run();  