import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KnowledgeBasesComponent } from './knowledge-bases/knowledge-bases.component';
import { CategoriesComponent } from './categories/categories.component';
import { CommentsComponent } from './comments/comments.component';
import { ReportsComponent } from './reports/reports.component';
import { KnowledgeBaseDatailComponent } from './knowledge-bases/knowledge-base-datail/knowledge-base-datail.component';

const routes: Routes = [
    {
        path: '',
        component: KnowledgeBasesComponent
    },
    {
        path: 'kbs',
        component: KnowledgeBasesComponent
    },
    {
        path: 'kbs-detail/:id',
        component: KnowledgeBaseDatailComponent
    },
    {
        path: 'categories',
        component: CategoriesComponent
    },
    {
        path: 'comments',
        component: CommentsComponent
    },
    {
        path: 'reports',
        component: ReportsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContentsRoutingModule {}
