using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace KnowledgeBase.ViewModels.Systems
{
    public class KnowledgeBaseCreateRequestValidator : AbstractValidator<KnowledgeBaseCreateRequest>
    {
        public KnowledgeBaseCreateRequestValidator()
        {
            RuleFor(x => x.CategoryId).NotNull().WithMessage("Category not null");
        }
    }
}
