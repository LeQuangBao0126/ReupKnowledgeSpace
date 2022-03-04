using KnowledgeBase.ViewModels.Systems;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace KnowledgeSpace.WebPortal.Services
{
    public class CategoryApiClient : ICategoriesApiClient
    {
        private readonly IHttpClientFactory _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _contextAccessor;
        public CategoryApiClient(IHttpClientFactory httpClient, IConfiguration configuration, IHttpContextAccessor contextAccessor)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _contextAccessor = contextAccessor;
        }
        public async Task<List<CategoryVm>> GetListCategories()
        {
            var client = _httpClient.CreateClient();
            client.BaseAddress = new Uri( _configuration["backend_api"]) ;
         
            var response = await client.GetAsync("/api/categories");
            var categories = JsonConvert.DeserializeObject<List<CategoryVm>>(await response.Content.ReadAsStringAsync());
            return categories;
        }
    }
}
