using Microsoft.EntityFrameworkCore;
using TravelApi.Models;

namespace TravelApi.Datas
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Location> Locations { get; set; }
        public DbSet<Tour> Tours { get; set; }
        public DbSet<BlogCategory> BlogCategories { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình quan hệ Location - Tour (1 - Nhiều)
            modelBuilder.Entity<Tour>()
                .HasOne(t => t.Location)
                .WithMany(l => l.Tours)
                .HasForeignKey(t => t.LocationId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình quan hệ BlogCategory - Post (1 - Nhiều)
            modelBuilder.Entity<Post>()
                .HasOne(p => p.BlogCategory)
                .WithMany(c => c.Posts)
                .HasForeignKey(p => p.BlogCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Index cho Slugs để tìm kiếm nhanh tối ưu SEO
            modelBuilder.Entity<Tour>().HasIndex(t => t.Slug).IsUnique();
            modelBuilder.Entity<Post>().HasIndex(p => p.Slug).IsUnique();
        }
    }
}