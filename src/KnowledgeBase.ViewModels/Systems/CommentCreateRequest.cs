using System;
using System.Collections.Generic;
using System.Text;

namespace KnowledgeBase.ViewModels.Systems
{
    public class CommentCreateRequest
    {
        public string Content { get; set; }
        public int KnowledgeBaseId { get; set; }
    }
}
