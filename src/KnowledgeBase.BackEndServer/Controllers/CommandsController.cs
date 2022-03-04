using KnowledgeBase.BackEndServer.Authorization;
using KnowledgeBase.BackEndServer.Constants;
using KnowledgeBase.BackEndServer.Data;
using KnowledgeBase.ViewModels.Systems;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeBase.BackEndServer.Controllers
{
    public class CommandsController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public CommandsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet()]
        [ClaimRequirement(FunctionCode.CONTENT_CATEGORY,CommandCode.VIEW)]
        public async Task<IActionResult> GetCommants()
        {
            var commands = _context.Commands;
            var commandVms = await commands.Select(u => new CommandVm()
            {
                Id = u.Id,
                Name = u.Name,
            }).ToListAsync();
            return Ok(commandVms);
        }
    }
}
