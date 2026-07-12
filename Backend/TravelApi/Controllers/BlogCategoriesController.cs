using Microsoft.AspNetCore.Mvc;
using TravelApi.Dtos;
using TravelApi.Services;

namespace TravelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogCategoriesController : ControllerBase
    {
        private readonly IBlogCategoryService _categoryService;
        public BlogCategoriesController(IBlogCategoryService categoryService) => _categoryService = categoryService;

        [HttpGet] public async Task<ActionResult<IEnumerable<BlogCategoryResponseDto>>> GetAll() => Ok(await _categoryService.GetAllAsync());
        [HttpGet("{id:int}")] public async Task<ActionResult<BlogCategoryResponseDto>> GetById(int id) { var res = await _categoryService.GetByIdAsync(id); return res == null ? NotFound() : Ok(res); }
        [HttpPost] public async Task<ActionResult<BlogCategoryResponseDto>> Create(BlogCategoryCreateDto dto) { var res = await _categoryService.CreateAsync(dto); return CreatedAtAction(nameof(GetById), new { id = res.Id }, res); }
        [HttpPut("{id:int}")] public async Task<IActionResult> Update(int id, BlogCategoryCreateDto dto) => await _categoryService.UpdateAsync(id, dto) ? NoContent() : NotFound();
        [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id) => await _categoryService.DeleteAsync(id) ? NoContent() : NotFound();
    }
}