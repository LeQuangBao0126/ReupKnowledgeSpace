using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeBase.BackEndServer.Helpers
{
    public  class ApiResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public ApiResponse(int statusCode , string message = null)
        {
            StatusCode = statusCode;
            Message = message != null ? message : GetDedaultMessageForStatusCode(statusCode);
        }
        public string GetDedaultMessageForStatusCode(int statusCode)
        {
            switch (statusCode)
            {
                case 200:
                    return "Ok";
                case 401:
                    return "UnAuthorize";
                case 404:
                    return "Resource Not Found";
                case 500:
                    return "An Error Has Terminated System";
                default:
                    return "An Error Has Terminated System";
            }
        }
    }
}
