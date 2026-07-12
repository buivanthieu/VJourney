using TravelApi.Dtos;

public interface ILocationService
{
    Task<IEnumerable<LocationResponseDto>> GetAllAsync();
    Task<LocationResponseDto?> GetByIdAsync(int id);
    Task<LocationResponseDto?> GetBySlugAsync(string slug);
    Task<LocationResponseDto> CreateAsync(LocationCreateDto dto);
    Task<bool> UpdateAsync(int id, LocationCreateDto dto);
    Task<bool> DeleteAsync(int id);
}