using TravelApi.Dtos;

public interface IPostService
{
    Task<IEnumerable<PostResponseDto>> GetAllAsync();
    Task<PostResponseDto?> GetByIdAsync(int id);
    Task<PostResponseDto?> GetBySlugAsync(string slug);
    Task<PostResponseDto> CreateAsync(PostCreateDto dto);
    Task<bool> UpdateAsync(int id, PostCreateDto dto);
    Task<bool> DeleteAsync(int id);
}