using Microsoft.AspNetCore.Mvc;
using TravelApi.Dtos;
using TravelApi.Services;

namespace TravelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;
        public PostsController(IPostService postService) => _postService = postService;

        [HttpGet] public async Task<ActionResult<IEnumerable<PostResponseDto>>> GetAll() => Ok(await _postService.GetAllAsync());
        [HttpGet("{id:int}")] public async Task<ActionResult<PostResponseDto>> GetById(int id) { var res = await _postService.GetByIdAsync(id); return res == null ? NotFound() : Ok(res); }
        [HttpGet("slug/{slug}")] public async Task<ActionResult<PostResponseDto>> GetBySlug(string slug) { var res = await _postService.GetBySlugAsync(slug); return res == null ? NotFound() : Ok(res); }
        [HttpPost] public async Task<ActionResult<PostResponseDto>> Create(PostCreateDto dto) { var res = await _postService.CreateAsync(dto); return CreatedAtAction(nameof(GetById), new { id = res.Id }, res); }
        [HttpPut("{id:int}")] public async Task<IActionResult> Update(int id, PostCreateDto dto) => await _postService.UpdateAsync(id, dto) ? NoContent() : NotFound();
        [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id) => await _postService.DeleteAsync(id) ? NoContent() : NotFound();
    }
}