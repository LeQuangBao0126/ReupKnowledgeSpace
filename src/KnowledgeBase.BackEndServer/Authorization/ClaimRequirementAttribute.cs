using KnowledgeBase.BackEndServer.Constants;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeBase.BackEndServer.Authorization
{
    public class ClaimRequirementAttribute : TypeFilterAttribute
    {
        public ClaimRequirementAttribute(FunctionCode functionCode , CommandCode commandCode) 
            : base(typeof(ClaimRequirementFilter))
        {
            Arguments = new object[] { functionCode, commandCode };
        }
    }
}
