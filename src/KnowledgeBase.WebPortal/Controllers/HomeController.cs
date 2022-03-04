using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using KnowledgeSpace.WebPortal.Models;
using KnowledgeSpace.WebPortal.Services;

namespace KnowledgeSpace.WebPortal.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ICategoriesApiClient _categoriesApiClient;
        private readonly IKnowledgeBaseApiClient _knowledgeBaseApiClient;

        public HomeController(ILogger<HomeController> logger, ICategoriesApiClient categoriesApiClient, IKnowledgeBaseApiClient knowledgeBaseApiClient)
        {
            _logger = logger;
            _categoriesApiClient = categoriesApiClient;
            _knowledgeBaseApiClient = knowledgeBaseApiClient;
        }
        public async Task<IActionResult> Index()
        {
            var categories = await _categoriesApiClient.GetListCategories();
            var popularKbs = await _knowledgeBaseApiClient.GetPopularKnowledgeBases();
            var latestKbs = await _knowledgeBaseApiClient.GetLatestKnowledgeBases();
            // var labels = await _categoriesApiClient.GetListCategories();
            var result = new HomeViewModel()
            {
                LatestKnowledgeBases = latestKbs,
                PopularKnowledgeBases = popularKbs,
                PopularLabels = null
            };
            return View(result);
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
       
    }
}
