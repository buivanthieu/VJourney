using TravelApi.Dtos;
using TravelApi.Models;
using TravelApi.Repositories;
using System.Text.RegularExpressions;

namespace TravelApi.Services
{
    
    public class LocationService : ILocationService
    {
        private readonly IRepository<Location> _locationRepo;
        public LocationService(IRepository<Location> locationRepo) => _locationRepo = locationRepo;

        public async Task<IEnumerable<LocationResponseDto>> GetAllAsync()
        {
            var locations = await _locationRepo.GetAllAsync();
            return locations.Select(l => new LocationResponseDto { Id = l.Id, Name = l.Name, Slug = l.Slug, Description = l.Description });
        }

        public async Task<LocationResponseDto?> GetByIdAsync(int id)
        {
            var l = await _locationRepo.GetAsync(x => x.Id == id);
            return l == null ? null : new LocationResponseDto { Id = l.Id, Name = l.Name, Slug = l.Slug, Description = l.Description };
        }

        public async Task<LocationResponseDto?> GetBySlugAsync(string slug)
        {
            var l = await _locationRepo.GetAsync(x => x.Slug == slug);
            return l == null ? null : new LocationResponseDto { Id = l.Id, Name = l.Name, Slug = l.Slug, Description = l.Description };
        }

        public async Task<LocationResponseDto> CreateAsync(LocationCreateDto dto)
        {
            var location = new Location { Name = dto.Name, Description = dto.Description, Slug = GenerateSlug(dto.Name) };
            await _locationRepo.AddAsync(location); await _locationRepo.SaveAsync();
            return new LocationResponseDto { Id = location.Id, Name = location.Name, Slug = location.Slug, Description = location.Description };
        }

        public async Task<bool> UpdateAsync(int id, LocationCreateDto dto)
        {
            var existing = await _locationRepo.GetAsync(x => x.Id == id);
            if (existing == null) return false;

            existing.Name = dto.Name; existing.Description = dto.Description; existing.Slug = GenerateSlug(dto.Name);
            _locationRepo.Update(existing); await _locationRepo.SaveAsync(); return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _locationRepo.GetAsync(x => x.Id == id);
            if (existing == null) return false;
            _locationRepo.Remove(existing); await _locationRepo.SaveAsync(); return true;
        }

        private static string GenerateSlug(string phrase)
        {
            string str = phrase.ToLower();
            string[] arr1 = ["á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ", "đ", "é", "è", "ẻ", "ẽ", "ẹ", "ê", "ế", "ề", "ể", "ễ", "ệ", "í", "ì", "ỉ", "ĩ", "ị", "ó", "ò", "ỏ", "õ", "ọ", "ô", "ố", "ồ", "ổ", "ỗ", "ộ", "ơ", "ớ", "ờ", "ở", "ỡ", "ợ", "ú", "ù", "ủ", "ũ", "ụ", "ư", "ứ", "ừ", "ử", "ữ", "ự", "ý", "ỳ", "ỷ", "ỹ", "ỵ"];
            string[] arr2 = ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "d", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "i", "i", "i", "i", "i", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "y", "y", "y", "y", "y"];
            for (int i = 0; i < arr1.Length; i++) str = str.Replace(arr1[i], arr2[i]);
            str = Regex.Replace(str, @"[^a-z0-9\s-]", ""); str = Regex.Replace(str, @"\s+", " ").Trim();
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
            return Regex.Replace(str, @"\s", "-");
        }
    }
}