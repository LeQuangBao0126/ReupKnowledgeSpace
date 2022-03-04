using KnowledgeBase.BackEndServer.Data;
using KnowledgeBase.BackEndServer.Data.Entities;
using KnowledgeBase.ViewModels;
using KnowledgeBase.ViewModels.Systems;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeBase.BackEndServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize("Bearer")]
    public class RolesController : ControllerBase
    {
        public readonly RoleManager<IdentityRole> _roleManager;
        public readonly ApplicationDbContext _context;
        public RolesController(RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            _roleManager = roleManager;
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var con = HttpContext.User.Claims;
            var tokens = await HttpContext.GetTokenAsync("access_token");
            return Ok(_roleManager.Roles.ToList());
        }
        [HttpPost]
        public async Task<IActionResult> PostRole([FromBody] RoleCreateRequest roleVm)
        {
            var role = new IdentityRole()
            {
                Id = roleVm.Id,
                Name = roleVm.Name,
                NormalizedName = roleVm.Name.ToUpper()
            };
            var results = await _roleManager.CreateAsync(role);
            if (results.Succeeded)
            {
                return Ok(role);
            }
            return BadRequest(results.Errors);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role != null) return Ok(role);
            return NotFound();
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRole(string id,[FromBody] RoleViewModel roleVm)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null) return NotFound();
            role.Name = roleVm.Name;
            role.NormalizedName = roleVm.Name.ToUpper();
            await _roleManager.UpdateAsync(role);
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> PutRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null) return NotFound();
            if (role.Name == "Admin") return BadRequest("ko dc xoa quyen admin");
            await _roleManager.DeleteAsync(role);
            return Ok();
        }
        [HttpGet("paging")]
        public async Task<IActionResult> GetRolesPaging(string filter, int pageIndex, int pageSize)
        {
            var query = _roleManager.Roles;
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Id.Contains(filter) || x.Name.Contains(filter));
            }
            var totalRecords = await query.CountAsync();
            var items = await query.Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new RoleViewModel()
                {
                    Id = r.Id,
                    Name = r.Name
                })
                .ToListAsync();

            var pagination = new Pagination<RoleViewModel>
            {
                Items = items,
                TotalRecords = totalRecords,
                Page = pageIndex,
                PageSize = pageSize
            };
            return Ok(pagination);
        }

        [HttpGet("{roleId}/permissions")]
        public async Task<IActionResult> GetPermissionsByRoleId(string roleId)
        {
            var permissions = from p in _context.Permissions
                              join c in _context.Commands on p.CommandId equals c.Id
                              join f in _context.Functions on p.FunctionId equals f.Id
                              where p.RoleId == roleId
                              select new PermissionVm
                              {
                                  CommandId = p.CommandId,
                                  FunctionId =p.FunctionId,
                                  RoleId = roleId
                              };
            return Ok(await permissions.ToListAsync());              
        }
        [HttpPut("{roleId}/permissions")]
        public async Task<IActionResult> PutPermissionsByRoleId(string roleId , [FromBody] UpdatePermissionRequest permissionVms)
        {
            try
            {
                var newPermissions = new List<Permission>();
                if (permissionVms.Permissions.Count > 0)
                {
                    foreach (var per in permissionVms.Permissions)
                    {
                        newPermissions.Add(new Permission(per.FunctionId, per.RoleId, per.CommandId));
                    }
                }
                var existingPermissions = _context.Permissions.Where(x => x.RoleId == roleId);
                _context.Permissions.RemoveRange(existingPermissions);
                await _context.Permissions.AddRangeAsync(newPermissions);
                var result = await _context.SaveChangesAsync();
                if (result > 0)
                {
                    return Ok();
                }
                return BadRequest();
            }
            catch(Exception e)
            {
                return BadRequest();
            }
          
            return BadRequest();
        }
    }
}
