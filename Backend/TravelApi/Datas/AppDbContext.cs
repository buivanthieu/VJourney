// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using TravelApi.Models;

namespace TravelApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
         

        public DbSet<Tour> Tours { get; set; }
         
        public DbSet<Location> Locations { get; set; }
        public DbSet<BlogCategory> BlogCategories { get; set; }
         
        public DbSet<Post> Posts { get; set; }
         
    }
}