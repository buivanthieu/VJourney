using TravelApi.Dtos;
using TravelApi.Models;

namespace TravelApi.Services
{
    public interface IContactService
    {
        Task<IEnumerable<Contact>> GetAllContactsAsync();
        Task<Contact?> GetContactByIdAsync(int id);
        Task<Contact> CreateContactAsync(ContactCreateDto dto);
        Task<bool> DeleteContactAsync(int id);
    }
}
