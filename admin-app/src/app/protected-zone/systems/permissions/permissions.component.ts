import { Component, OnInit } from '@angular/core';
import { Permission, PermissionUpdate, Role } from '@app/shared/models';
import { AuthService, PermissionsService, RolesService } from '@app/shared/services';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/treetable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  //
  subscription = new Subscription();
  blockedPanel: boolean = false;
  //
  selectedRole: Role;
  roles: Role[];
  functions: any;
  flattenFunctions: any[];
  public items: TreeNode[] = [];
  //
  selectedCreates: string[] = [];
  selectedViews: string[] = [];
  selectedUpdates: string[] = [];
  selectedDeletes: string[] = [];
  selectedApproves: string[] = [];
  //
  public isSelectedAllCreate   =false;
  public isSelectedAllView = false;
  public isSelectedAllUpdate=false;
  public isSelectedAllDelete=false;
  public isSelectedAllApproves=false;

  constructor(private roleService: RolesService,
    private authService: AuthService,
    private permissionService: PermissionsService,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissionScreen();
  }
  loadRoles() {
    this.roleService.getAll().subscribe(response => {
      this.roles = response;
      this.selectedRole = this.roles[0];
      console.log(this.selectedRole)
    })
  }
  onRolesChanges() {
    this.loadPermissionScreen();
  }

   loadPermissionScreen() {

    this.blockedPanel = true
    this.permissionService.getPermissionScreen().subscribe(response => {
      let functionTree = this.utilitiesService.UnflatteringForTree(response);
      this.items = <TreeNode[]>functionTree;
      this.flattenFunctions = response;
      //console.log("flattenFunctions",this.flattenFunctions)
      this.fillPermissions(this.selectedRole.id);
      // console.log(this.items);
    })
  }
  fillPermissions(rolesId) {
    this.roleService.getPermissionByRoleId(rolesId).subscribe(response => {
      this.selectedCreates = [];
      this.selectedViews = [];
      this.selectedUpdates = [];
      this.selectedDeletes = [];
      this.selectedApproves = [];
      response.forEach(element => {
        if (element.commandId === 'CREATE') {
          this.selectedCreates.push(element.functionId);
        }
        if (element.commandId === "VIEW") {
          this.selectedViews.push(element.functionId);
        }
        if (element.commandId === "UPDATE") {
          this.selectedUpdates.push(element.functionId);
        }
        if (element.commandId === "DELETE") {
          this.selectedDeletes.push(element.functionId);
        }
        if (element.commandId === "APPROVE") {
          this.selectedApproves.push(element.functionId);
        }
      });
     
      // if(this.selectedUpdates.length == this.flattenFunctions.length){
      //   this.isSelectedAllUpdate = true;
      // }
      // if(this.selectedDeletes.length == this.flattenFunctions.length){
      //   this.isSelectedAllDelete = true;
      // }
      // if(this.selectedApproves.length == this.flattenFunctions.length){
      //   this.isSelectedAllApproves = true;
      // }
      setTimeout(() => {
        this.blockedPanel = false;
      }, 500);
    });
  }
  checkedChange(e, commandId, functionId, parentId) {
    switch (commandId) {
      case 'CREATE':
        if (e.checked) {
          this.selectedCreates.push(functionId);
          if (parentId === null) {
            const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
            this.selectedCreates.push(...childFunctions);
          } else {
            if (this.selectedCreates.filter(x => x === parentId).length === 0) {
              this.selectedCreates.push(parentId);
            }
          }
        }else{
          ///
        }
        break;
      case 'VIEW':
        if (e.checked) {
          this.selectedViews.push(functionId);
          if (parentId === null) {
            const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
            this.selectedViews.push(...childFunctions);
          } else {
            if (this.selectedViews.filter(x => x === parentId).length === 0) {
              this.selectedViews.push(parentId);
            }
          }
        }
        break;
      case 'UPDATE':
        if (e.checked) {
          this.selectedUpdates.push(functionId);
          if (parentId === null) {
            const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
            this.selectedUpdates.push(...childFunctions);
          } else {
            if (this.selectedUpdates.filter(x => x === parentId).length === 0) {
              this.selectedUpdates.push(parentId);
            }
          }
        }
        break;
      case 'DELETE':
        if (e.checked) {
          this.selectedDeletes.push(functionId);
          if (parentId === null) {
            const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
            this.selectedDeletes.push(...childFunctions);
          } else {
            if (this.selectedDeletes.filter(x => x === parentId).length === 0) {
              this.selectedDeletes.push(parentId);
            }
          }
        }
        break;
      case 'APPROVE':
        if (e.checked) {
          this.selectedApproves.push(functionId);
          if (parentId === null) {
            const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
            this.selectedApproves.push(...childFunctions);
          } else {
            if (this.selectedApproves.filter(x => x === parentId).length === 0) {
              this.selectedApproves.push(parentId);
            }
          }
        }
        break;

      default:
        break;
    }
  }
  checkAll(e, commandId) {
    switch (commandId) {
      case 'CREATE':
        if(e.checked){
          this.selectedCreates=[]
          this.flattenFunctions.forEach(element=>{
            this.selectedCreates.push(element.id);
          }) 
        }else{
          this.selectedCreates =[]
        }
        break;
      case 'VIEW':
        if(e.checked){
          this.selectedViews=[]
          this.flattenFunctions.forEach(element=>{
            this.selectedViews.push(element.id);
          }) 
        }else{
          this.selectedViews =[]
        }
        break;
      case 'UPDATE':
        if(e.checked){
          this.selectedUpdates=[]
          this.flattenFunctions.forEach(element=>{
            this.selectedUpdates.push(element.id);
          }) 
        }else{
          this.selectedUpdates =[]
        }
        break;
      case 'DELETE':
        if(e.checked){
          this.selectedDeletes=[]
          this.flattenFunctions.forEach(element=>{
            this.selectedDeletes.push(element.id);
          }) 
        }else{
          this.selectedDeletes =[]
        }
        break;
      case 'APPROVE':
        if(e.checked){
          this.selectedApproves=[]
          this.flattenFunctions.forEach(element=>{
            this.selectedApproves.push(element.id);
          }) 
        }else{
          this.selectedApproves =[]
        }
        break;
      default:
        break;
    }
  }

  public savePermission() {
    if (this.selectedRole.id == null) {
      alert("Bạn chưa chọn nhóm quyền nào ... óc chó à ");
        return;
    }
    const listPermissions: Permission[] = [];

    this.selectedCreates.forEach(element => {
      listPermissions.push({
        functionId: element,
        roleId: this.selectedRole.id,
        commandId: 'CREATE'
      });
    });
    this.selectedUpdates.forEach(element => {
      listPermissions.push({
        functionId: element,
        roleId: this.selectedRole.id,
        commandId: 'UPDATE'
      });
    });
    this.selectedDeletes.forEach(element => {
      listPermissions.push({
        functionId: element,
        roleId: this.selectedRole.id,
        commandId: 'DELETE'
      });
    });
    this.selectedViews.forEach(element => {
      listPermissions.push({
        functionId: element,
        roleId: this.selectedRole.id,
        commandId:'VIEW'
      });
    });

    this.selectedApproves.forEach(element => {
      listPermissions.push({
        functionId: element,
        roleId: this.selectedRole.id,
        commandId: 'APPROVE'
      });
    });
    const permissionsUpdateRequest = new PermissionUpdate();
    permissionsUpdateRequest.permissions = listPermissions;
    // console.log(permissionsUpdateRequest.permissions );
    // return
    this.subscription.add(this.permissionService.save(this.selectedRole.id, permissionsUpdateRequest)
      .subscribe(() => {
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }, error => {
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }));
  }
}

//dropdown chứa role để khi chọn ..selected role thì sẽ load 