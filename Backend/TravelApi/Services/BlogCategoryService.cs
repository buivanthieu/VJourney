using TravelApi.Dtos;
using TravelApi.Models;
using TravelApi.Repositories;
using System.Text.RegularExpressions;

namespace TravelApi.Services
{
   
    public class BlogCategoryService : IBlogCategoryService
    {
        private readonly IRepository<BlogCategory> _categoryRepo;
        public BlogCategoryService(IRepository<BlogCategory> categoryRepo) => _categoryRepo = categoryRepo;

        public async Task<IEnumerable<BlogCategoryResponseDto>> GetAllAsync()
        {
            var categories = await _categoryRepo.GetAllAsync();
            return categories.Select(c => new BlogCategoryResponseDto { Id = c.Id, Name = c.Name, Slug = c.Slug });
        }

        public async Task<BlogCategoryResponseDto?> GetByIdAsync(int id)
        {
            var c = await _categoryRepo.GetAsync(x => x.Id == id);
            return c == null ? null : new BlogCategoryResponseDto { Id = c.Id, Name = c.Name, Slug = c.Slug };
        }

        public async Task<BlogCategoryResponseDto> CreateAsync(BlogCategoryCreateDto dto)
        {
            var category = new BlogCategory { Name = dto.Name, Slug = GenerateSlug(dto.Name) };
            await _categoryRepo.AddAsync(category); 
            await _categoryRepo.SaveAsync();
            return new BlogCategoryResponseDto { Id = category.Id, Name = category.Name, Slug = category.Slug };
        }

        public async Task<bool> UpdateAsync(int id, BlogCategoryCreateDto dto)
        {
            var existing = await _categoryRepo.GetAsync(x => x.Id == id);
            if (existing == null) return false;

            existing.Name = dto.Name; existing.Slug = GenerateSlug(dto.Name);
            _categoryRepo.Update(existing); await _categoryRepo.SaveAsync(); return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _categoryRepo.GetAsync(x => x.Id == id);
            if (existing == null) return false;
            _categoryRepo.Remove(existing); await _categoryRepo.SaveAsync(); return true;
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