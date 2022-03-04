using KnowledgeBase.ViewModels.Systems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeSpace.WebPortal.Services
{
    public interface ICategoriesApiClient
    {
        Task<List<CategoryVm>> GetListCategories();
    }
}
