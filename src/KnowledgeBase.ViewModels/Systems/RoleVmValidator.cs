using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace KnowledgeBase.ViewModels.Systems
{
    public class RoleVmValidator : AbstractValidator<RoleCreateRequest>
    {
        public RoleVmValidator()
        {
          RuleFor(x => x.Name).NotEmpty();
          RuleFor(x => x.Id).NotNull().WithMessage("Truong Id ko dc rong");
          RuleFor(x => x.Name).NotNull().WithMessage("Truong Name ko dc rong");
        }
    }
}
