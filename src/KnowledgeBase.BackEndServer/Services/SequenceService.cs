using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeBase.BackEndServer.Services
{
    public interface ISequenceService
    {
        Task<int> GetKnowledgeBaseNewId();
    }
    public class SequenceService : ISequenceService
    {
        private readonly IConfiguration _configuration;
        public SequenceService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<int> GetKnowledgeBaseNewId()
        {
            using (SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                var sql = @"SELECT (NEXT VALUE FOR KnowledgeBaseSequence)";
                var number = conn.ExecuteScalar<int>(sql, null, null, 120, CommandType.Text);
                return number;
            }
        }
    }
}
