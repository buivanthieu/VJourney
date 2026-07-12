using TravelApi.Dtos;

public interface IBlogCategoryService
{
    Task<IEnumerable<BlogCategoryResponseDto>> GetAllAsync();
    Task<BlogCategoryResponseDto?> GetByIdAsync(int id);
    Task<BlogCategoryResponseDto> CreateAsync(BlogCategoryCreateDto dto);
    Task<bool> UpdateAsync(int id, BlogCategoryCreateDto dto);
    Task<bool> DeleteAsync(int id);
}
