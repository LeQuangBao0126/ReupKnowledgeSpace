import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories/categories.component';
import { KnowledgeBasesComponent } from './knowledge-bases/knowledge-bases.component';
import { CommentsComponent } from './comments/comments.component';
import { ReportsComponent } from './reports/reports.component';
import { ContentsRoutingModule } from './contents-routing.module';
import {  CategoriesDetailComponent } from './categories/category-detail/category-detail.component';
import { KnowledgeBaseDatailComponent } from './knowledge-bases/knowledge-base-datail/knowledge-base-datail.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ValidationMessageModule } from '@app/shared/modules';
import {InputNumberModule} from 'primeng/inputnumber';
import {TreeTableModule} from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox'
import {EditorModule} from 'primeng/editor';
import {ChipsModule} from 'primeng/chips';
import {FileUploadModule} from 'primeng/fileupload';

@NgModule({
  declarations: [CategoriesComponent, KnowledgeBasesComponent, CommentsComponent, ReportsComponent, CategoriesDetailComponent, KnowledgeBaseDatailComponent],
  imports: [
    CommonModule,
    ContentsRoutingModule, ModalModule.forRoot(),
    ButtonModule,PanelModule,TableModule,PaginatorModule,BlockUIModule,
    ProgressSpinnerModule,ToastModule,InputTextModule,
    ReactiveFormsModule,FormsModule,
    InputNumberModule,TreeTableModule,TreeModule,DropdownModule,CheckboxModule,
    EditorModule,ChipsModule,ValidationMessageModule,FileUploadModule
  ]
})
export class ContentsModule { }
