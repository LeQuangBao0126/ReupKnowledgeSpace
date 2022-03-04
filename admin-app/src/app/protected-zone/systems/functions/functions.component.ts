import { Component, OnInit } from '@angular/core';
import { HighlightDirective } from '@app/shared/directives/highlight.directive';
import { CommandAssign } from '@app/shared/models';
import { FunctionsService } from '@app/shared/services';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TreeNode } from 'primeng/api';
import { CommandsAssignComponent } from './commands-assign/commands-assign.component';
import { FunctionsDetailComponent } from './functions-detail/functions-detail.component';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent implements OnInit {

  public bsModalRef: BsModalRef;
  public blockedPanel = false;
  public blockedPanelCommand = false;
  public showCommandGrid = false;
  // -----------------Function-----------------
  public items: TreeNode[] = [];
  public selectedItems :any;

  // ---------------Command------------------------------
  public commands: any[] = [];
  public selectedCommandItems = [];

  constructor(
    private modalService: BsModalService,
    private functionsService: FunctionsService,
    private utilitiesService: UtilitiesService) {
  }

  ngOnInit() {
    this.loadData();
  }

  togglePanel() {
    if (this.showCommandGrid) {
     // if (this.selectedItems.length === 1) {
        this.loadDataCommand();
     // }
    }

  }
  loadData(selectionId = null) {
    this.blockedPanel = true;
    this.functionsService.getAll()
      .subscribe((response: any) => {
        const functionTree = this.utilitiesService.UnflatteringForTree(response);
        this.items = <TreeNode[]>functionTree;
          console.log(this.items)
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }, error => {
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      });
  }

  showAddModal() {
    this.bsModalRef = this.modalService.show(FunctionsDetailComponent,
      {
        class: 'modal-lg',
        backdrop: 'static'
      });
    this.bsModalRef.content.saved.subscribe(response => {
      this.bsModalRef.hide();
      this.loadData();
      this.selectedItems = [];
    });
  }

  showEditModal() {
    const initialState = {
      entityId: this.selectedItems[0].data.id
    };
    this.bsModalRef = this.modalService.show(FunctionsDetailComponent,
      {
        initialState: initialState,
        class: 'modal-lg',
        backdrop: 'static'
      });


    this.bsModalRef.content.saved.subscribe((response) => {
      this.bsModalRef.hide();
      this.loadData(response.id);
    });
  }

  nodeSelect(event: any) {
    this.selectedCommandItems = [];
    this.commands = [];
    if (this.selectedItems && this.showCommandGrid) {
      this.loadDataCommand();
    }
  }
  
  nodeUnSelect(event: any) {
    this.selectedCommandItems = [];
    this.commands = [];
    if (this.selectedItems && this.showCommandGrid) {
      this.loadDataCommand();
    }
  }

  deleteItems() {
    
  }

  deleteItemsConfirm(id: string) {
    this.blockedPanel = true;
    this.functionsService.delete(id).subscribe(() => {
      this.loadData();
     // this.selectedItems = [];
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }, error => {
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    });
  }
  loadDataCommand() {
    this.blockedPanelCommand = true;
    this.functionsService.getAllCommandsByFunctionId(this.selectedItems[0].id)
      .subscribe((response: any) => {
        this.commands = response;
        
        if (this.selectedCommandItems.length === 0 && this.commands.length > 0) {
          this.selectedCommandItems.push(this.commands[0]);
        }
        this.blockedPanelCommand = false;
      }, error => {
        this.blockedPanelCommand = false;
      });
  }

  removeCommands() {
    const selectedCommandIds = [];
    this.selectedCommandItems.forEach(element => {
      selectedCommandIds.push(element.id);
    });
    
  }

  removeCommandsConfirm(ids: string[]) {
    this.blockedPanelCommand = true;
    const entity = new CommandAssign();
    entity.commandIds = ids;
    // this.functionsService.deleteCommandsFromFunction(this.selectedItems[0].id, entity).subscribe(() => {
    //   this.loadDataCommand();
    //   this.selectedCommandItems = [];
    //   // this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
    //   this.blockedPanelCommand = false;
    // }, error => {
    //   this.blockedPanelCommand = false;
    // });
  }

  addCommandsToFunction() {
    
    const initialState = {
      existingCommands: this.commands.map(x => x.id),
      functionId: this.selectedItems[0].id
    };
    this.bsModalRef = this.modalService.show(CommandsAssignComponent,
      {
        initialState: initialState,
        class: 'modal-lg',
        backdrop: 'static'
      });
    this.bsModalRef.content.chosenEvent.subscribe((response: any[]) => {
      this.bsModalRef.hide();
      this.loadDataCommand();
      this.selectedCommandItems = [];
    });
  }
}