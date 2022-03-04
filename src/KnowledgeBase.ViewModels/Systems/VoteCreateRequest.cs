using System;
using System.Collections.Generic;
using System.Text;

namespace KnowledgeBase.ViewModels.Systems
{
    public class VoteCreateRequest
    {
        public int KnowledgeBaseId { get; set; }
        public string UserId { get; set; }
    }
}
