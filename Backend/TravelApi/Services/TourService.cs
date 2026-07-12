using TravelApi.Dtos;
using TravelApi.Models;
using TravelApi.Repositories;
using System.Text.RegularExpressions;

namespace TravelApi.Services
{
    

    public class TourService : ITourService
    {
        private readonly IRepository<Tour> _tourRepo;
        public TourService(IRepository<Tour> tourRepo) => _tourRepo = tourRepo;

        public async Task<IEnumerable<TourResponseDto>> GetAllAsync()
        {
            var tours = await _tourRepo.GetAllAsync(includeProperties: "Location");
            return tours.Select(t => MapToDto(t));
        }

        public async Task<TourResponseDto?> GetByIdAsync(int id)
        {
            var tour = await _tourRepo.GetAsync(t => t.Id == id, includeProperties: "Location");
            return tour != null ? MapToDto(tour) : null;
        }

        public async Task<TourResponseDto?> GetBySlugAsync(string slug)
        {
            var tour = await _tourRepo.GetAsync(t => t.Slug == slug, includeProperties: "Location");
            return tour != null ? MapToDto(tour) : null;
        }

        public async Task<TourResponseDto> CreateAsync(TourCreateDto dto)
        {
            var tour = new Tour
            {
                Title = dto.Title,
                Slug = GenerateSlug(dto.Title),
                Image = dto.Image,
                Duration = dto.Duration,
                Price = dto.Price,
                LocationId = dto.LocationId,
                StartLocation = dto.StartLocation,
                Content = dto.Content
            };
            await _tourRepo.AddAsync(tour); await _tourRepo.SaveAsync();
            var saved = await _tourRepo.GetAsync(t => t.Id == tour.Id, includeProperties: "Location");
            return MapToDto(saved!);
        }

        public async Task<bool> UpdateAsync(int id, TourCreateDto dto)
        {
            var existing = await _tourRepo.GetAsync(t => t.Id == id);
            if (existing == null) return false;

            existing.Title = dto.Title; existing.Slug = GenerateSlug(dto.Title); existing.Image = dto.Image;
            existing.Duration = dto.Duration; existing.Price = dto.Price; existing.LocationId = dto.LocationId;
            existing.StartLocation = dto.StartLocation; existing.Content = dto.Content;

            _tourRepo.Update(existing); await _tourRepo.SaveAsync(); return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var tour = await _tourRepo.GetAsync(t => t.Id == id);
            if (tour == null) return false;
            _tourRepo.Remove(tour); await _tourRepo.SaveAsync(); return true;
        }

        private static TourResponseDto MapToDto(Tour t) => new()
        {
            Id = t.Id,
            Title = t.Title,
            Slug = t.Slug,
            Image = t.Image,
            Duration = t.Duration,
            Price = t.Price,
            LocationId = t.LocationId,
            StartLocation = t.StartLocation,
            Content = t.Content,
            LocationName = t.Location?.Name ?? "Chưa xác định địa điểm"
        };

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