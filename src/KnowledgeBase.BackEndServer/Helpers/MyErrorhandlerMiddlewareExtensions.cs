using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeBase.BackEndServer.Helpers
{
    public static class MyErrorhandlerMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalHandlerErrorMyMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ErrorWrappingMiddleware>();
        }
    }
}
