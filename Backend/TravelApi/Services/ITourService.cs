using TravelApi.Dtos;

public interface ITourService
{
    Task<IEnumerable<TourResponseDto>> GetAllAsync();
    Task<TourResponseDto?> GetByIdAsync(int id);
    Task<TourResponseDto?> GetBySlugAsync(string slug);
    Task<TourResponseDto> CreateAsync(TourCreateDto dto);
    Task<bool> UpdateAsync(int id, TourCreateDto dto);
    Task<bool> DeleteAsync(int id);
}