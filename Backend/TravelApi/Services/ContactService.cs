using TravelApi.Dtos;
using TravelApi.Models;
using TravelApi.Repositories;

namespace TravelApi.Services
{
    public class ContactService : IContactService
    {
        private readonly IRepository<Contact> _repo;
        public ContactService(IRepository<Contact> repo) => _repo = repo;

        public async Task<IEnumerable<Contact>> GetAllContactsAsync() => await _repo.GetAllAsync();

        public async Task<Contact?> GetContactByIdAsync(int id)
        {
            var contact = await _repo.GetAsync(x => x.Id == id);
            return contact;
        }

        public async Task<Contact> CreateContactAsync(ContactCreateDto dto)
        {
            var contact = new Contact { Name = dto.Name, Phone = dto.Phone, Email = dto.Email, Message = dto.Message };
            await _repo.AddAsync(contact);
            await _repo.SaveAsync();
            return contact;
        }

        public async Task<bool> DeleteContactAsync(int id)
        {
            var contact = await _repo.GetAsync(x => x.Id == id);
            if (contact == null) return false;
            _repo.Remove(contact);
            await _repo.SaveAsync();
            return true;
        }
    }
}