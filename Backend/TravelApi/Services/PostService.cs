using TravelApi.Dtos;
using TravelApi.Models;
using TravelApi.Repositories;
using System.Text.RegularExpressions;

namespace TravelApi.Services
{
  

    public class PostService : IPostService
    {
        private readonly IRepository<Post> _postRepo;
        public PostService(IRepository<Post> postRepo) => _postRepo = postRepo;

        public async Task<IEnumerable<PostResponseDto>> GetAllAsync()
        {
            var posts = await _postRepo.GetAllAsync(includeProperties: "BlogCategory");
            return posts.Select(p => MapToDto(p));
        }

        public async Task<PostResponseDto?> GetByIdAsync(int id)
        {
            var post = await _postRepo.GetAsync(p => p.Id == id, includeProperties: "BlogCategory");
            return post == null ? null : MapToDto(post);
        }

        public async Task<PostResponseDto?> GetBySlugAsync(string slug)
        {
            var post = await _postRepo.GetAsync(p => p.Slug == slug, includeProperties: "BlogCategory");
            return post == null ? null : MapToDto(post);
        }

        public async Task<PostResponseDto> CreateAsync(PostCreateDto dto)
        {
            var post = new Post
            {
                Title = dto.Title,
                Slug = GenerateSlug(dto.Title),
                Image = dto.Image,
                Summary = dto.Summary,
                Content = dto.Content,
                BlogCategoryId = dto.BlogCategoryId,
                CreatedAt = DateTime.UtcNow
            };
            await _postRepo.AddAsync(post); await _postRepo.SaveAsync();
            var saved = await _postRepo.GetAsync(p => p.Id == post.Id, includeProperties: "BlogCategory");
            return MapToDto(saved!);
        }

        public async Task<bool> UpdateAsync(int id, PostCreateDto dto)
        {
            var existing = await _postRepo.GetAsync(p => p.Id == id);
            if (existing == null) return false;

            existing.Title = dto.Title; existing.Slug = GenerateSlug(dto.Title); existing.Image = dto.Image;
            existing.Summary = dto.Summary; existing.Content = dto.Content; existing.BlogCategoryId = dto.BlogCategoryId;

            _postRepo.Update(existing); await _postRepo.SaveAsync(); return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _postRepo.GetAsync(p => p.Id == id);
            if (existing == null) return false;
            _postRepo.Remove(existing); await _postRepo.SaveAsync(); return true;
        }

        private static PostResponseDto MapToDto(Post p) => new()
        {
            Id = p.Id,
            Title = p.Title,
            Slug = p.Slug,
            Image = p.Image,
            Summary = p.Summary,
            Content = p.Content,
            CreatedAt = p.CreatedAt,
            BlogCategoryId = p.BlogCategoryId,
            BlogCategoryName = p.BlogCategory?.Name ?? "Chưa có danh mục"
        };

        private static string GenerateSlug(string title)
        {
            string str = title.ToLower();
            string[] arr1 = ["á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ", "đ", "é", "è", "ẻ", "ẽ", "ẹ", "ê", "ế", "ề", "ể", "ễ", "ệ", "í", "ì", "ỉ", "ĩ", "ị", "ó", "ò", "ỏ", "õ", "ọ", "ô", "ố", "ồ", "ổ", "ỗ", "ộ", "ơ", "ớ", "ờ", "ở", "ỡ", "ợ", "ú", "ù", "ủ", "ũ", "ụ", "ư", "ứ", "ừ", "ử", "ữ", "ự", "ý", "ỳ", "ỷ", "ỹ", "ỵ"];
            string[] arr2 = ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "d", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "i", "i", "i", "i", "i", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "y", "y", "y", "y", "y"];
            for (int i = 0; i < arr1.Length; i++) str = str.Replace(arr1[i], arr2[i]);
            str = Regex.Replace(str, @"[^a-z0-9\s-]", ""); str = Regex.Replace(str, @"\s+", " ").Trim();
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
            return Regex.Replace(str, @"\s", "-");
        }
    }
}