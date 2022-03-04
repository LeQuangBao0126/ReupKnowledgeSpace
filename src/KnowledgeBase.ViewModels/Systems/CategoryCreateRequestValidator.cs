using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace KnowledgeBase.ViewModels.Systems
{
    public class CategoryCreateRequestValidator : AbstractValidator<CategoryCreateRequest>
    {
        public CategoryCreateRequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Category Name is not empty");
            RuleFor(x => x.Name).NotNull().WithMessage("Category Name is not null");
        }
    }
}
