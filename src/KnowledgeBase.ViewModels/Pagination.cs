using System;
using System.Collections.Generic;
using System.Text;

namespace KnowledgeBase.ViewModels
{
    public class Pagination<T>
    {
        public List<T> Items { get; set; }

        public int TotalRecords { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int PageCount
        {
            get
            {
                var count = (double)TotalRecords / PageSize;
                return (int)Math.Ceiling(count);
            }
        }
    }
}
