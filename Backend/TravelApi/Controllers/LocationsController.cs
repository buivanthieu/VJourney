using Microsoft.AspNetCore.Mvc;
using TravelApi.Dtos;
using TravelApi.Services;

namespace TravelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly ILocationService _locationService;
        public LocationsController(ILocationService locationService) => _locationService = locationService;

        [HttpGet] public async Task<ActionResult<IEnumerable<LocationResponseDto>>> GetAll() => Ok(await _locationService.GetAllAsync());
        [HttpGet("{id:int}")] public async Task<ActionResult<LocationResponseDto>> GetById(int id) 
        { 
            var res = await _locationService.GetByIdAsync(id); 
            return res == null ? NotFound() : Ok(res); 
        }
        [HttpGet("slug/{slug}")] public async Task<ActionResult<LocationResponseDto>> GetBySlug(string slug) 
        { 
            var res = await _locationService.GetBySlugAsync(slug); 
            return res == null ? NotFound() : Ok(res); 
        }
        [HttpPost] public async Task<ActionResult<LocationResponseDto>> Create(LocationCreateDto dto) 
        { 
            var res = await _locationService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = res.Id }, res); 
        }
        [HttpPut("{id:int}")] public async Task<IActionResult> Update(int id, LocationCreateDto dto) => await _locationService.UpdateAsync(id, dto) ? NoContent() : NotFound();
        [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id) => await _locationService.DeleteAsync(id) ? NoContent() : NotFound();
    }
}