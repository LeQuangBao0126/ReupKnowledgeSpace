using KnowledgeBase.BackEndServer.Authorization;
using KnowledgeBase.BackEndServer.Constants;
using KnowledgeBase.BackEndServer.Data;
using KnowledgeBase.BackEndServer.Data.Entities;
using KnowledgeBase.BackEndServer.Helpers;
using KnowledgeBase.ViewModels;
using KnowledgeBase.ViewModels.Systems;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeBase.BackEndServer.Controllers
{
    public class CategoriesController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [ClaimRequirement(FunctionCode.CONTENT_CATEGORY,CommandCode.CREATE)]
        [ApiValidationFilter]
        public async Task<IActionResult> PostCategory([FromBody] CategoryCreateRequest request)
        {
            var category = new Category()
            {
                Name = request.Name,
                ParentId = request.ParentId,
                SortOrder = request.SortOrder,
                SeoAlias = request.SeoAlias,
                SeoDescription = request.SeoDescription
            };
            _context.Categories.Add(category);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return CreatedAtAction(nameof(GetById), new { id = category.Id }, request);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categorys = await _context.Categories.ToListAsync();
            var categoryvms = categorys.Select(c => CreateCategoryVm(c)).ToList();
            return Ok(categoryvms);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetCategoriesPaging(string filter, int pageIndex, int pageSize)
        {
            var query = _context.Categories.AsQueryable();
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Name.Contains(filter)
                || x.Name.Contains(filter));
            }
            var totalRecords = await query.CountAsync();
            var items = await query.Skip((pageIndex - 1) * pageSize)
                .Take(pageSize).ToListAsync();

            var data = items.Select(c => CreateCategoryVm(c)).ToList();

            var pagination = new Pagination<CategoryVm>
            {
                Items = data,
                TotalRecords = totalRecords,
            };
            return Ok(pagination);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();
            CategoryVm categoryvm = CreateCategoryVm(category);

            return Ok(categoryvm);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, [FromBody] CategoryCreateRequest request)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            if (id == request.ParentId)
            {
                return BadRequest("Category cannot be a child itself.");
            }

            category.Name = request.Name;
            category.ParentId = request.ParentId;
            category.SortOrder = request.SortOrder;
            category.SeoDescription = request.SeoDescription;
            category.SeoAlias = request.SeoAlias;

            _context.Categories.Update(category);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return NoContent();
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            _context.Categories.Remove(category);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                CategoryVm categoryvm = CreateCategoryVm(category);
                return Ok(categoryvm);
            }
            return BadRequest();
        }

        private static CategoryVm CreateCategoryVm(Category category)
        {
            return new CategoryVm()
            {
                Id = category.Id,
                Name = category.Name,
                SortOrder = category.SortOrder,
                ParentId = category.ParentId,
                NumberOfTickets = category.NumberOfTickets,
                SeoDescription = category.SeoDescription,
                SeoAlias = category.SeoDescription
            };
        }
    }
}
