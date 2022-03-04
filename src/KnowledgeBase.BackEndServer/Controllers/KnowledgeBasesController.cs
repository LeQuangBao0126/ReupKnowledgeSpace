using KnowledgeBase.BackEndServer.Data;
using KnowledgeBase.ViewModels.Systems;
using KnowledgeBase.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KnowledgeBase.BackEndServer.Data.Entities;
using KnowledgeBase.BackEndServer.Services;
using KnowledgeBase.BackEndServer.Helpers;
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;
using System.IO;
using KnowledgeBase.BackEndServer.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace KnowledgeBase.BackEndServer.Controllers
{
    public class KnowledgeBasesController : BaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly ISequenceService _sequenceService;
        private readonly IStorageService _storageService;
        public KnowledgeBasesController(ApplicationDbContext context, ISequenceService sequenceService,
            IStorageService storageService)
        {
            _context = context;
            _sequenceService = sequenceService;
            _storageService = storageService;
        }
        [HttpPost]
        [AllowAnonymous]
        //[Consumes("multipart/form-data")]
        public async Task<IActionResult> PostKnowledgeBase([FromForm] KnowledgeBaseCreateRequest request)
        {
            try
            {
                var knowledgeBase = new KnowledgeBases()
                {
                    CategoryId = request.CategoryId,
                    CreateDate = DateTime.Now,
                    LastModifiedDate = DateTime.Now,
                    Title = request.Title,

                    SeoAlias = request.SeoAlias,

                    Description = request.Description,

                    Environment = request.Environment,

                    Problem = request.Problem,

                    StepToReproduce = request.StepToReproduce,

                    ErrorMessage = request.ErrorMessage,

                    Workaround = request.Workaround,

                    Note = request.Note,

                    Labels = request.Labels.Length >0 ? string.Join(",",request.Labels) : "ko co gi"
                };
                knowledgeBase.Id = await _sequenceService.GetKnowledgeBaseNewId();
                knowledgeBase.OwnerUserId = User.GetUserId() ?? "anonymous";
                if (!string.IsNullOrEmpty(request.SeoAlias))
                {
                    request.SeoAlias = TextHelper.ToUnsignString(request.SeoAlias);
                }

                //Process attachment
                if (request.Attachments != null && request.Attachments.Count > 0)
                {
                    foreach (var attachment in request.Attachments)
                    {
                        var attachmentEntity = await SaveFile(knowledgeBase.Id, attachment);
                        _context.Attachments.Add(attachmentEntity);
                    }
                }
                _context.KnowledgeBases.Add(knowledgeBase);

                //Process label
                if (request.Labels.Length >0)
                {
                    await ProcessLabel(request, knowledgeBase);
                }

                var result = await _context.SaveChangesAsync();

                if (result > 0)
                {
                    return CreatedAtAction(nameof(GetById), new
                    {
                        id = knowledgeBase.Id
                    }, request);
                }
                else
                {
                    return BadRequest();
                }

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private async Task<Attachment> SaveFile(int knowledegeBaseId, IFormFile file)
        {
            var originalFileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(originalFileName)}";
            await _storageService.SaveFileAsync(file.OpenReadStream(), fileName);
            var attachmentEntity = new Attachment()
            {
                FileName = fileName,
                FilePath = _storageService.GetFileUrl(fileName),
                FileSize = file.Length,
                FileType = Path.GetExtension(fileName),
                KnowledgeBaseId = knowledegeBaseId,
            };
            return attachmentEntity;
        }

        private async Task ProcessLabel(KnowledgeBaseCreateRequest request, KnowledgeBases knowledgeBase)
        {
            string[] labels = request.Labels;
            foreach (var labelText in labels)
            {
                var labelId = TextHelper.ToUnsignString(labelText);

                var existingLabel = await _context.Labels.FindAsync(labelId);
                if (existingLabel == null)
                {
                    var labelEntity = new Label()
                    {
                        Id = labelId,
                        Name = labelText
                    };
                    _context.Labels.Add(labelEntity);
                }
                var labelInKnowledgeBase = new LabelInKnowledgeBase()
                {
                    KnowledgeBaseId = knowledgeBase.Id,
                    LabelId = labelId
                };
                _context.LabelInKnowledgeBases.Add(labelInKnowledgeBase);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetKnowledgeBases()
        {
            var knowledgeBases = _context.KnowledgeBases;

            var knowledgeBasevms = await knowledgeBases.Select(u => new KnowledgeBaseQuickVm()
            {
                Id = u.Id,
                CategoryId = u.CategoryId,
                Description = u.Description,
                SeoAlias = u.SeoAlias,
                Title = u.Title
            }).ToListAsync();

            return Ok(knowledgeBasevms);
        }

        [HttpGet("latest")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLatestKnowledgeBases(int take = 5)
        {
            var knowledgeBases = _context.KnowledgeBases.OrderByDescending(x=>x.CreateDate).Take(take);

            var knowledgeBasevms = await knowledgeBases.Select(u => new KnowledgeBaseQuickVm()
            {
                Id = u.Id,
                CategoryId = u.CategoryId,
                Description = u.Description,
                SeoAlias = u.SeoAlias,
                Title = u.Title
            }).ToListAsync();

            return Ok(knowledgeBasevms);
        }
        [HttpGet("popular")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPopularKnowledgeBases(int take = 5)
        {
            var knowledgeBases = _context.KnowledgeBases.OrderByDescending(x => x.CreateDate).Take(take);
            var knowledgeBasevms = await knowledgeBases.Select(u => new KnowledgeBaseQuickVm()
            {
                Id = u.Id,
                CategoryId = u.CategoryId,
                Description = u.Description,
                SeoAlias = u.SeoAlias,
                Title = u.Title
            }).ToListAsync();
            return Ok(knowledgeBasevms);
        }

        [HttpGet("filter")]
        [AllowAnonymous]
        public async Task<IActionResult> GetKnowledgeBasesPaging(string filter,int? categoryId, int pageIndex, int pageSize)
        {
           // var query = _context.KnowledgeBases.AsQueryable();
           var  query = from a in _context.KnowledgeBases
                    join c in _context.Categories on a.CategoryId equals c.Id
                    select new { a, c };

            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.a.Title.Contains(filter));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(x => x.a.CategoryId.Equals(categoryId.Value));
            }
            var totalRecords = await query.CountAsync();
            var items = await query.Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new KnowledgeBaseQuickVm()
                {
                    Id = u.a.Id,
                    CategoryId = u.a.CategoryId,
                    CategoryName = u.c.Name,
                    Description = u.a.Description,
                    SeoAlias = u.a.SeoAlias,
                    Title = u.a.Title
                })
                .ToListAsync();

            var pagination = new Pagination<KnowledgeBaseQuickVm>
            {
                Items = items,
                TotalRecords = totalRecords,
            };
            return Ok(pagination);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var knowledgeBase = await _context.KnowledgeBases.FindAsync(id);
            if (knowledgeBase == null)
                return NotFound();

            var knowledgeBaseVm = new KnowledgeBaseVm()
            {
                Id = knowledgeBase.CategoryId,

                CategoryId = knowledgeBase.CategoryId,

                Title = knowledgeBase.Title,

                SeoAlias = knowledgeBase.SeoAlias,

                Description = knowledgeBase.Description,

                Environment = knowledgeBase.Environment,

                Problem = knowledgeBase.Problem,

                StepToReproduce = knowledgeBase.StepToReproduce,

                ErrorMessage = knowledgeBase.ErrorMessage,

                Workaround = knowledgeBase.Workaround,

                Note = knowledgeBase.Note,

                OwnerUserId = knowledgeBase.OwnerUserId,

                Labels = string.IsNullOrEmpty(knowledgeBase.Labels) ? null: knowledgeBase.Labels.Split(","),

                CreateDate = knowledgeBase.CreateDate,

                LastModifiedDate = knowledgeBase.LastModifiedDate,

                NumberOfComments = knowledgeBase.NumberOfComments,

                NumberOfVotes = knowledgeBase.NumberOfVotes,

                NumberOfReports = knowledgeBase.NumberOfReports
            };
            var attachmentVms = _context.Attachments.Where(x => x.KnowledgeBaseId.Equals(knowledgeBase.Id))
                                                      .Select(x => new AttachmentVm() {
                                                          Id = x.Id,
                                                          KnowledgeBaseId = x.KnowledgeBaseId.Value,
                                                          FileName=x.FileName,
                                                          FilePath=x.FilePath,
                                                          FileSize=x.FileSize,
                                                          FileType=x.FileType,
                                                          CreateDate=x.CreateDate,
                                                          LastModifiedDate =x.LastModifiedDate
                                                      });
            knowledgeBaseVm.Attachments = attachmentVms.ToList();

            return Ok(knowledgeBaseVm);
        }

        [HttpPut("{id}")]
        //[Consumes("multipart/form-data")]
        public async Task<IActionResult> PutKnowledgeBase(int id, [FromForm] KnowledgeBaseCreateRequest request)
        {
            var knowledgeBase = await _context.KnowledgeBases.FindAsync(id);
            if (knowledgeBase == null)
                return NotFound();

            knowledgeBase.CategoryId = request.CategoryId;

            knowledgeBase.Title = request.Title;

            knowledgeBase.SeoAlias = request.SeoAlias;

            knowledgeBase.Description = request.Description;

            knowledgeBase.Environment = request.Environment;

            knowledgeBase.Problem = request.Problem;

            knowledgeBase.StepToReproduce = request.StepToReproduce;

            knowledgeBase.ErrorMessage = request.ErrorMessage;

            knowledgeBase.Workaround = request.Workaround;

            knowledgeBase.Note = request.Note;

            knowledgeBase.Labels = request.Labels.Length> 0 ? string.Join(",",request.Labels) : "" ;

            _context.KnowledgeBases.Update(knowledgeBase);

            if (request.Labels.Length>0)
            {
                await ProcessLabel(request, knowledgeBase);
            }
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return NoContent();
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKnowledgeBase(string id)
        {
            var knowledgeBase = await _context.KnowledgeBases.FindAsync(id);
            if (knowledgeBase == null)
                return NotFound();

            _context.KnowledgeBases.Remove(knowledgeBase);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                var knowledgeBasevm = new KnowledgeBaseVm()
                {
                    Id = knowledgeBase.CategoryId,

                    CategoryId = knowledgeBase.CategoryId,

                    Title = knowledgeBase.Title,

                    SeoAlias = knowledgeBase.SeoAlias,

                    Description = knowledgeBase.Description,

                    Environment = knowledgeBase.Environment,

                    Problem = knowledgeBase.Problem,

                    StepToReproduce = knowledgeBase.StepToReproduce,

                    ErrorMessage = knowledgeBase.ErrorMessage,

                    Workaround = knowledgeBase.Workaround,

                    Note = knowledgeBase.Note,

                    OwnerUserId = knowledgeBase.OwnerUserId,

                    Labels = string.IsNullOrEmpty(knowledgeBase.Labels) ? null : knowledgeBase.Labels.Split(","),

                    CreateDate = knowledgeBase.CreateDate,

                    LastModifiedDate = knowledgeBase.LastModifiedDate,

                    NumberOfComments = knowledgeBase.CategoryId,

                    NumberOfVotes = knowledgeBase.CategoryId,

                    NumberOfReports = knowledgeBase.CategoryId,
                };
                return Ok(knowledgeBasevm);
            }
            return BadRequest();
        }

        #region Comments
        [HttpGet("{knowledgeBaseId}/comments/filter")]
        public async Task<IActionResult> GetCommentsPaging(int knowledgeBaseId, string filter, int pageIndex, int pageSize)
        {
            var query = _context.Comments.Where(x => x.KnowledgeBaseId == knowledgeBaseId).AsQueryable();
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Content.Contains(filter));
            }
            var totalRecords = await query.CountAsync();
            var items = await query.Skip((pageIndex - 1 * pageSize))
                .Take(pageSize)
                .Select(c => new CommentVm()
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreateDate = c.CreateDate,
                    KnowledgeBaseId = c.KnowledgeBaseId,
                    LastModifiedDate = c.LastModifiedDate,
                    OwnwerUserId = c.OwnwerUserId
                })
                .ToListAsync();

            var pagination = new Pagination<CommentVm>
            {
                Items = items,
                TotalRecords = totalRecords,
            };
            return Ok(pagination);
        }
        [HttpGet("{knowledgeBaseId}/comments/{commentId}")]
        public async Task<IActionResult> GetCommentDetail(int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null)
                return NotFound();

            var commentVm = new CommentVm()
            {
                Id = comment.Id,
                Content = comment.Content,
                CreateDate = comment.CreateDate,
                KnowledgeBaseId = comment.KnowledgeBaseId,
                LastModifiedDate = comment.LastModifiedDate,
                OwnwerUserId = comment.OwnwerUserId
            };

            return Ok(commentVm);
        }

        [HttpPost("{knowledgeBaseId}/comments")]
        public async Task<IActionResult> PostComment(int knowledgeBaseId, [FromBody] CommentCreateRequest request)
        {
            var comment = new Comment()
            {
                Content = request.Content,
                KnowledgeBaseId = request.KnowledgeBaseId,
                OwnwerUserId = string.Empty/*TODO: GET USER FROM CLAIM*/,
            };
            _context.Comments.Add(comment);

            var knowledgeBase = await _context.KnowledgeBases.FindAsync(knowledgeBaseId);
            if (knowledgeBase != null)
                return BadRequest();
            knowledgeBase.NumberOfComments = knowledgeBase.NumberOfVotes.GetValueOrDefault(0) + 1;
            _context.KnowledgeBases.Update(knowledgeBase);

            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return CreatedAtAction(nameof(GetCommentDetail), new { id = knowledgeBaseId, commentId = comment.Id }, request);
            }
            else
            {
                return BadRequest();
            }
        }
        [HttpDelete("{knowledgeBaseId}/comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(int knowledgeBaseId, int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null)
                return NotFound();

            _context.Comments.Remove(comment);

            var knowledgeBase = await _context.KnowledgeBases.FindAsync(knowledgeBaseId);
            if (knowledgeBase != null)
                return BadRequest();
            knowledgeBase.NumberOfComments = knowledgeBase.NumberOfVotes.GetValueOrDefault(0) - 1;
            _context.KnowledgeBases.Update(knowledgeBase);

            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                var commentVm = new CommentVm()
                {
                    Id = comment.Id,
                    Content = comment.Content,
                    CreateDate = comment.CreateDate,
                    KnowledgeBaseId = comment.KnowledgeBaseId,
                    LastModifiedDate = comment.LastModifiedDate,
                    OwnwerUserId = comment.OwnwerUserId
                };
                return Ok(commentVm);
            }
            return BadRequest();
        }
        #endregion

        #region Votes

        [HttpGet("{knowledgeBaseId}/votes")]
        public async Task<IActionResult> GetVotes(int knowledgeBaseId)
        {
            var votes = await _context.Votes
                .Where(x => x.KnowledgeBaseId == knowledgeBaseId)
                .Select(x => new VoteVm()
                {
                    UserId = x.UserId,
                    KnowledgeBaseId = x.KnowledgeBaseId,
                    CreateDate = x.CreateDate,
                    LastModifiedDate = x.LastModifiedDate
                }).ToListAsync();

            return Ok(votes);
        }

        [HttpPost("{knowledgeBaseId}/votes")]
        public async Task<IActionResult> PostVote(int knowledgeBaseId, [FromBody] VoteCreateRequest request)
        {
            var vote = await _context.Votes.FindAsync(knowledgeBaseId, request.UserId);
            if (vote != null)
                return BadRequest("This user has been voted for this KB");

            vote = new Vote()
            {
                KnowledgeBaseId = knowledgeBaseId,
                UserId = request.UserId
            };
            _context.Votes.Add(vote);

            var knowledgeBase = await _context.KnowledgeBases.FindAsync(knowledgeBaseId);
            if (knowledgeBase != null)
                return BadRequest();
            knowledgeBase.NumberOfVotes = knowledgeBase.NumberOfVotes.GetValueOrDefault(0) + 1;
            _context.KnowledgeBases.Update(knowledgeBase);

            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return NoContent();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpDelete("{knowledgeBaseId}/votes/{userId}")]
        public async Task<IActionResult> DeleteVote(int knowledgeBaseId, string userId)
        {
            var vote = await _context.Votes.FindAsync(knowledgeBaseId, userId);
            if (vote == null)
                return NotFound();

            var knowledgeBase = await _context.KnowledgeBases.FindAsync(knowledgeBaseId);
            if (knowledgeBase != null)
                return BadRequest();
            knowledgeBase.NumberOfVotes = knowledgeBase.NumberOfVotes.GetValueOrDefault(0) - 1;
            _context.KnowledgeBases.Update(knowledgeBase);

            _context.Votes.Remove(vote);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok();
            }
            return BadRequest();
        }

        #endregion Votes

        #region Reports

        [HttpGet("{knowledgeBaseId}/reports/filter")]
        public async Task<IActionResult> GetReportsPaging(int knowledgeBaseId, string filter, int pageIndex, int pageSize)
        {
            var query = _context.Reports.Where(x => x.KnowledgeBaseId == knowledgeBaseId).AsQueryable();
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Content.Contains(filter));
            }
            var totalRecords = await query.CountAsync();
            var items = await query.Skip((pageIndex - 1 * pageSize))
                .Take(pageSize)
                .Select(c => new ReportVm()
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreateDate = c.CreateDate,
                    KnowledgeBaseId = c.KnowledgeBaseId,
                    LastModifiedDate = c.LastModifiedDate,
                    IsProcessed = false,
                    ReportUserId = c.ReportUserId
                })
                .ToListAsync();

            var pagination = new Pagination<ReportVm>
            {
                Items = items,
                TotalRecords = totalRecords,
            };
            return Ok(pagination);
        }

        [HttpGet("{knowledgeBaseId}/reports/{reportId}")]
        public async Task<IActionResult> GetReportDetail(int knowledgeBaseId, int reportId)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null)
                return NotFound();

            var reportVm = new ReportVm()
            {
                Id = report.Id,
                Content = report.Content,
                CreateDate = report.CreateDate,
                KnowledgeBaseId = report.KnowledgeBaseId,
                LastModifiedDate = report.LastModifiedDate,
                IsProcessed = report.IsProcessed,
                ReportUserId = report.ReportUserId
            };

            return Ok(reportVm);
        }

        [HttpPost("{knowledgeBaseId}/reports")]
        public async Task<IActionResult> PostReport(int knowledgeBaseId, [FromBody] ReportCreateRequest request)
        {
            var report = new Report()
            {
                Content = request.Content,
                KnowledgeBaseId = knowledgeBaseId,
                ReportUserId = request.ReportUserId,
                IsProcessed = false
            };
            _context.Reports.Add(report);

            var knowledgeBase = await _context.KnowledgeBases.FindAsync(knowledgeBaseId);
            if (knowledgeBase != null)
                return BadRequest();
            knowledgeBase.NumberOfComments = knowledgeBase.NumberOfReports.GetValueOrDefault(0) + 1;
            _context.KnowledgeBases.Update(knowledgeBase);

            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPut("{knowledgeBaseId}/reports/{reportId}")]
        public async Task<IActionResult> PutReport(int reportId, [FromBody] CommentCreateRequest request)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null)
                return NotFound();
            if (report.ReportUserId != User.Identity.Name)
                return Forbid();

            report.Content = request.Content;
            _context.Reports.Update(report);

            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return NoContent();
            }
            return BadRequest();
        }

        [HttpDelete("{knowledgeBaseId}/reports/{reportId}")]
        public async Task<IActionResult> DeleteReport(int knowledgeBaseId, int reportId)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null)
                return NotFound();

            _context.Reports.Remove(report);

            var knowledgeBase = await _context.KnowledgeBases.FindAsync(knowledgeBaseId);
            if (knowledgeBase != null)
                return BadRequest();
            knowledgeBase.NumberOfComments = knowledgeBase.NumberOfReports.GetValueOrDefault(0) - 1;
            _context.KnowledgeBases.Update(knowledgeBase);

            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok();
            }
            return BadRequest();
        }

        #endregion Reports

        #region Attachments
        [HttpPost("{knowledgeBaseId}/attachments")]
        public  IActionResult GetAttachment(int knowledgeBaseId)
        {
            var list = _context.Attachments.Where(x => x.KnowledgeBaseId.Equals(knowledgeBaseId)).ToList();
            return Ok(list);
        }

       


        #endregion  Attachments

    }
}
