import { Component, OnInit } from '@angular/core';
import { Pagination, Role } from '@app/shared/models';
import { RolesService } from '@app/shared/services';
import { BsModalRef,BsModalService } from 'ngx-bootstrap/modal';
import {MessageService} from 'primeng/api';
import { Subscription } from 'rxjs';
import { RolesDetailComponent } from './roles-detail/roles-detail.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  providers:[MessageService]
})
export class RolesComponent implements OnInit {
  public count :number =0;
  private subscription = new Subscription();
  // Default
  public bsModalRef: BsModalRef;
  public blockedPanel = false;
  /**
   * Paging
   */
  public pageIndex = 1;
  public pageSize = 3;
  public pageDisplay = 10;
  public totalRecords: number;
  public keyword = '';
  // Role
  public items: any[];
  public selectedItems = [];
  constructor(private rolesService :RolesService,    
    private modalService: BsModalService ,
    private messageService : MessageService) { }

  ngOnInit(): void {
    this.loadData()
  }
  loadData(selectedId = null) {
    this.blockedPanel = true;
    this.subscription.add(this.rolesService.getAllPaging(this.keyword, this.pageIndex, this.pageSize)
      .subscribe((response: Pagination<Role>) => {
        this.processLoadData(selectedId, response);
        setTimeout(() => { this.blockedPanel = false; }, 500);
      }, error => {
        setTimeout(() => { this.blockedPanel = false; }, 500);
      }) );
  }
  private processLoadData(selectedId = null, response: Pagination<Role>) {
    this.items = response.items;
    this.pageIndex = this.pageIndex;
    this.pageSize = this.pageSize;
    this.totalRecords = response.totalRecords;
    // if (this.selectedItems.length === 0 && this.items.length > 0) {
    //   this.selectedItems.push(this.items[0]);
    // }
    // if (selectedId != null && this.items.length > 0) {
    //   this.selectedItems = this.items.filter(x => x.Id === selectedId);
    // }
  }

  pageChanged(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadData();
  }
  showAddModal() {
    this.bsModalRef = this.modalService.show(RolesDetailComponent,
      {
        class: 'modal-lg',
        backdrop: 'static'
      });
    this.bsModalRef.content.savedEvent.subscribe((response) => {
      this.bsModalRef.hide();
      this.loadData();
      this.selectedItems = [];
    });
  }
  showEditModal() {
    if (this.selectedItems.length === 0) {
      return;
    }
    const initialState = {
      entityId: this.selectedItems[0].id
    };
    this.bsModalRef = this.modalService.show(RolesDetailComponent,
      {
        initialState: initialState,
        class: 'modal-lg',
        backdrop: 'static'
      });

    this.subscription.add( this.bsModalRef.content.savedEvent.subscribe((response) => {
      this.bsModalRef.hide();
      this.messageService.add({severity: response.severity  , detail: response.message});
      // console.log(response)
      this.loadData(response.id);
    }));
  }

   
   

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
