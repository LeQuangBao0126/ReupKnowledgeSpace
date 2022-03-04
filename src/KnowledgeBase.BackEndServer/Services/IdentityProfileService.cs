using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using KnowledgeBase.BackEndServer.Data;
using KnowledgeBase.BackEndServer.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace KnowledgeBase.BackEndServer.Services
{
    public class IdentityProfileService : IProfileService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;

        public IdentityProfileService(UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }
        public async Task IsActiveAsync(IsActiveContext context)
        {
            var sub = context.Subject.GetSubjectId();
            var user = await _userManager.FindByIdAsync(sub);
            context.IsActive = user != null;
        }
        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var sub  = context.Subject.GetSubjectId();
            var user =  await _userManager.FindByIdAsync(sub);
            var roles = await _userManager.GetRolesAsync(user);
            var query = from p in _context.Permissions
                             join f in _context.Functions on p.FunctionId equals f.Id
                             join c in _context.Commands on p.CommandId equals c.Id
                             join r in _context.Roles on p.RoleId equals r.Name
                             where roles.Contains(r.Name)
                             select f.Id + "_" + c.Id;

            var permission = query.Distinct().ToList();
            var claims = new List<Claim>()
            {
                new Claim("Name",user.UserName),
                new Claim("Email",user.Email),
                new Claim(ClaimTypes.NameIdentifier,user.Id),
                new Claim("Roles",string.Join(",", roles)),
                new Claim("Permissions", JsonConvert.SerializeObject(permission))
            };
            context.IssuedClaims = claims;
        }
       
    }
}
