using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeBase.BackEndServer.Helpers
{
    public class ApiBadRequestResponse : ApiResponse
    {
        public IEnumerable<string>  Errors { get; set; }
        public ApiBadRequestResponse(string message) : base(400)
        {
        }
        public ApiBadRequestResponse(ModelStateDictionary modelState) : base(400)
        {
            if (!modelState.IsValid)
            {
                Errors = modelState.SelectMany(x => x.Value.Errors).Select(x => x.ErrorMessage).ToArray();
            }
        }
    }
}
