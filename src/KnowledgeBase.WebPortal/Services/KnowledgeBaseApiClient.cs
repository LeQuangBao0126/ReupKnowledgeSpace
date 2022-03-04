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
    public class KnowledgeBaseApiClient : IKnowledgeBaseApiClient
    {
        private readonly IHttpClientFactory _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _contextAccessor;
        public KnowledgeBaseApiClient(
            IHttpClientFactory httpClient,         
            IConfiguration configuration, IHttpContextAccessor contextAccessor
            )
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _contextAccessor = contextAccessor;
        }
        public async Task<List<KnowledgeBaseQuickVm>> GetLatestKnowledgeBases()
        {
            var client = _httpClient.CreateClient();
            client.BaseAddress = new Uri(_configuration["backend_api"]);
           
            var response = await client.GetAsync("/api/KnowledgeBases/latest");
            var kbsQuick = JsonConvert.DeserializeObject<List<KnowledgeBaseQuickVm>>(await response.Content.ReadAsStringAsync());
            return kbsQuick;
        }

        public async Task<List<KnowledgeBaseQuickVm>> GetPopularKnowledgeBases()
        {
            var client = _httpClient.CreateClient();
            client.BaseAddress = new Uri(_configuration["backend_api"]);
            //string access_token = await _contextAccessor.HttpContext.GetTokenAsync("access_token");
            //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", access_token);
            var response = await client.GetAsync("/api/KnowledgeBases/popular");
            var kbsQuick = JsonConvert.DeserializeObject<List<KnowledgeBaseQuickVm>>(await response.Content.ReadAsStringAsync());
            return kbsQuick;
        }
    }
}
