import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionsComponent } from './functions/functions.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { RolesDetailComponent } from './roles/roles-detail/roles-detail.component'
import { UsersDetailComponent } from './users/users-detail/users-detail.component';
import { RolesAssignComponent } from './users/roles-assign/roles-assign.component';
import { SystemsRoutingModule } from './systems-routing.module';
import { FunctionsDetailComponent } from './functions/functions-detail/functions-detail.component';
import { CommandsAssignComponent } from './functions/commands-assign/commands-assign.component';

import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ModalModule } from "ngx-bootstrap/modal";
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ValidationMessageModule } from '@app/shared/modules';
import {InputNumberModule} from 'primeng/inputnumber';
import {TreeTableModule} from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox'
import { PermissionDirective } from '@app/shared/directives/permission.directive';
import { HighlightDirective } from '@app/shared/directives/highlight.directive';

@NgModule({
  declarations: [FunctionsComponent, UsersComponent, RolesComponent, PermissionsComponent,
     RolesDetailComponent, UsersDetailComponent, RolesAssignComponent,
      FunctionsDetailComponent, CommandsAssignComponent,
      HighlightDirective,PermissionDirective
    ],
  imports: [
    CommonModule,
    SystemsRoutingModule, ButtonModule, PanelModule, TableModule, PaginatorModule,
    ProgressSpinnerModule, BlockUIModule, ToastModule,
    ModalModule.forRoot(),
    InputTextModule,
    ReactiveFormsModule, FormsModule,
    ValidationMessageModule,InputNumberModule,TreeTableModule,DropdownModule,CheckboxModule,TreeModule
  ],
  providers: []
})
export class SystemsModule { }
