using KnowledgeBase.BackEndServer.Constants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeBase.BackEndServer.Authorization
{
    public class ClaimRequirementFilter : IAuthorizationFilter
    {
        private readonly FunctionCode _functionCode;
        private readonly CommandCode _commandCode;
        public ClaimRequirementFilter(FunctionCode functionCode, CommandCode commandCode)
        {
            _functionCode = functionCode;
            _commandCode = commandCode;
        }
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var permissions = context.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "Permissions");
            if (permissions != null)
            {
                var listPermissions = JsonConvert.DeserializeObject<List<string>>(permissions.Value);
                if (!listPermissions.Contains(_functionCode + "_" + _commandCode))
                {
                    context.Result = new ForbidResult();
                }
            }
            else
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
