// Controllers/ContactController.cs
using Microsoft.AspNetCore.Mvc;
using TravelApi.Dtos;
using TravelApi.Services;

namespace TravelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _service;
        public ContactController(IContactService service) => _service = service;

        [HttpGet] // API cho trang Admin xem toàn bộ danh sách Form khách gửi
        public async Task<IActionResult> Get() => Ok(await _service.GetAllContactsAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var res = await _service.GetContactByIdAsync(id);
            return res != null ? Ok(res) : NotFound();
        }

        [HttpPost] // API ngoài Client gửi form
        public async Task<IActionResult> Post([FromBody] ContactCreateDto dto)
        {
            var res = await _service.CreateContactAsync(dto);
            return Ok(new { success = true, data = res });
        }

        [HttpDelete("{id}")] // API Admin xóa form rác
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteContactAsync(id);
            return success ? Ok(new { success = true }) : NotFound();
        }
    }
}