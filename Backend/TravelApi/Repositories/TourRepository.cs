using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TravelApi.Datas; 
using TravelApi.Models;
 

namespace TravelApi.Repositories
{
    public class TourRepository : IRepository<Tour>
    {
        private readonly AppDbContext _context;

    public TourRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Tour>> GetAllAsync(Expression<Func<Tour, bool>>? filter = null, string? includeProperties = null)
    {
        IQueryable<Tour> query = _context.Tours;  

                if (filter != null)
                {
                    query = query.Where(filter);  
                }

        if (!string.IsNullOrEmpty(includeProperties))
        {
            foreach (var includeProp in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProp);  
            }
        }
        else
        {
            query = query.Include(t => t.Location);
        }

        return await query.ToListAsync();  
    }

    public async Task<Tour?> GetAsync(Expression<Func<Tour, bool>> filter, string? includeProperties = null)
    {
        IQueryable<Tour> query = _context.Tours.Where(filter);  

                if (!string.IsNullOrEmpty(includeProperties))
        {
            foreach (var includeProp in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProp);  
                    }
        }
        else
        {
            query = query.Include(t => t.Location); 
        }

        return await query.FirstOrDefaultAsync();  
    }

    public async Task AddAsync(Tour entity) => await _context.Tours.AddAsync(entity); 

    public void Update(Tour entity) => _context.Tours.Update(entity);  

    public void Remove(Tour entity) => _context.Tours.Remove(entity);  

    public async Task SaveAsync() => await _context.SaveChangesAsync();  
    }
}