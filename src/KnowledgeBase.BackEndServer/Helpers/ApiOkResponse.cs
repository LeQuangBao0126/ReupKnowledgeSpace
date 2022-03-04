using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeBase.BackEndServer.Helpers
{
    public class ApiOkResponse : ApiResponse
    {
        public object Result { get; set; }
        public ApiOkResponse(object result) : base(200)
        {
            Result = result;
        }
    }
}
