using KnowledgeBase.BackEndServer.Data;
using KnowledgeBase.ViewModels.Systems;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeBase.BackEndServer.Controllers
{
    public class LabelsController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public LabelsController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("popular")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPopularLabels()
        {
            var query = from l in _context.Labels
                        join lib in _context.LabelInKnowledgeBases on l.Id equals lib.LabelId
                        group new { l.Id ,l.Name} by new { l.Id, l.Name } into g
                        select new
                        {
                           Id = g.Key.Id,
                           Name = g.Key.Name,
                           Count = g.Count()
                        };
            //lấy những th nào có lượt count nhiều nhất sap xep
            var labels =await query.OrderByDescending(x => x.Count).Select(l => new LabelVM()
            {
                Id = l.Id,
                Name = l.Name
            }).ToListAsync();
            return Ok(labels);
        }              

    }
}
