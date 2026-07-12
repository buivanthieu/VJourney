using Microsoft.AspNetCore.Mvc;
using TravelApi.Dtos;
using TravelApi.Services;

namespace TravelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToursController : ControllerBase
    {
        private readonly ITourService _tourService;
        public ToursController(ITourService tourService) => _tourService = tourService;

        [HttpGet] public async Task<ActionResult<IEnumerable<TourResponseDto>>> GetAll() => Ok(await _tourService.GetAllAsync());
        [HttpGet("{id:int}")] public async Task<ActionResult<TourResponseDto>> GetById(int id) { var res = await _tourService.GetByIdAsync(id); return res == null ? NotFound() : Ok(res); }
        [HttpGet("slug/{slug}")] public async Task<ActionResult<TourResponseDto>> GetBySlug(string slug) { var res = await _tourService.GetBySlugAsync(slug); return res == null ? NotFound() : Ok(res); }
        [HttpPost] public async Task<ActionResult<TourResponseDto>> Create(TourCreateDto dto) { var res = await _tourService.CreateAsync(dto); return CreatedAtAction(nameof(GetById), new { id = res.Id }, res); }
        [HttpPut("{id:int}")] public async Task<IActionResult> Update(int id, TourCreateDto dto) => await _tourService.UpdateAsync(id, dto) ? NoContent() : NotFound();
        [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id) => await _tourService.DeleteAsync(id) ? NoContent() : NotFound();
    }
}