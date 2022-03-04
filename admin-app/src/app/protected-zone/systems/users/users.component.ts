import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Role, User } from '@app/shared/models';
import { UserService } from '@app/shared/services/users.services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UsersDetailComponent } from './users-detail/users-detail.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public bsModalRef: BsModalRef;
  //
  blockedPanel : boolean;
  subcription = new Subscription();

  items : User[]
  selectedItems: User[];
  //
  keyword :string ="";
  pageIndex : number = 1 ;
  pageSize :number =   2;
  totalRecords : number;
  //
  itemUserRoles : Role[] ;
  constructor(private userService: UserService ,private modalService: BsModalService ) { }

  ngOnInit() {
     this.loadData()
  }
  loadData(){
    this.blockedPanel = true;
    this.subcription.add(
        this.userService.getUserPaging(this.keyword,this.pageIndex,this.pageSize).subscribe(response =>{
          this.processData(response);
          setTimeout(() => { this.blockedPanel = false; }, 500);
        },error=> {
          setTimeout(() => { this.blockedPanel = false; }, 500);
        })
    )
  }
  processData(response){
      this.items = response.items;
      this.pageIndex = this.pageIndex;
      this.pageSize = this.pageSize;
      this.totalRecords = response.totalRecords;
  }

  showModal(userId){
      if(!userId){
        this.bsModalRef = this.modalService.show(UsersDetailComponent,
          {
            class: 'modal-lg',
            backdrop: 'static'
          });
        this.bsModalRef.content.savedEvent.subscribe((response) => {
          this.bsModalRef.hide();
          this.loadData();
          this.selectedItems = [];
        });
      }else{
        //edit
        const initialState = {
          entityId : userId
        }
        this.bsModalRef = this.modalService.show(UsersDetailComponent,
          {
            initialState: initialState,
            class: 'modal-lg',
            backdrop: 'static'
          });
        this.bsModalRef.content.savedEvent.subscribe((response) => {
          this.bsModalRef.hide();
          this.loadData();
          this.selectedItems = [];
        });
      }
  }

  onRowSelect(e){
      console.log(e.data);
      this.userService.getRolesByUserId(e.data.id).subscribe(response=>{
          console.log(response);
          this.itemUserRoles= response;
      });
  }






  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }
}
