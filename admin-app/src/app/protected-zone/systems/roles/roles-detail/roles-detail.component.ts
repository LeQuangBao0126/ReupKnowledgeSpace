import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RolesService } from '@app/shared/services';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-roles-detail',
  templateUrl: './roles-detail.component.html',
  styleUrls: ['./roles-detail.component.scss'],
  providers:[MessageService]
})
export class RolesDetailComponent implements OnInit {
  private subscription = new Subscription();
  public entityForm: FormGroup;
  public dialogTitle: string;
  private savedEvent: EventEmitter<any> = new EventEmitter();
  public entityId: string;
  public btnDisabled = false;

  public blockedPanel = false;
  constructor(
    private messageService : MessageService,
    public bsModalRef: BsModalRef,
    private rolesService: RolesService,
    private fb: FormBuilder) {
  }
 // Validate
 validation_messages = {
  'id': [
    { type: 'required', message: 'Trường này bắt buộc' },
    { type: 'maxlength', message: 'Bạn không được nhập quá 25 kí tự' }
  ],
  'name': [
    { type: 'required', message: 'Trường này bắt buộc' },
    { type: 'maxlength', message: 'Bạn không được nhập quá 30 kí tự' }
  ]
};
  ngOnInit(): void {
    this.entityForm = this.fb.group({
      'id': new FormControl({ value: '', disabled: true }, Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])),
      'name': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ]))
    });
   // console.log(this.entityId)
    if (this.entityId) {
      this.dialogTitle = 'Cập nhật';
      this.loadFormDetails(this.entityId);
      this.entityForm.controls['id'].disable({ onlySelf: true });
    } else {
      this.dialogTitle = 'Thêm mới';
      this.entityForm.controls['id'].enable({ onlySelf: true });
    }
  }
  loadFormDetails(roleId){
    this.blockedPanel = true;
    this.subscription.add(this.rolesService.getDetail(roleId).subscribe((response: any) => {
      this.entityForm.setValue({
        id: response.id,
        name: response.name,
      });
      setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 500);
    }, error => {
      setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 500);
    }));
  }
  saveChange() {
     
    this.btnDisabled = true;
    this.blockedPanel = true;
    if (this.entityId) {
      this.subscription.add(this.rolesService.updateRole(this.entityId, this.entityForm.getRawValue())
        .subscribe(() => {
          this.savedEvent.emit({
            id :this.entityForm.value.name,
            message : "saveChanges thành công",
            severity: "success"
          });
          this.btnDisabled = false;
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 500);
        }, error => {
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 500);
        }));
    } else {

      this.subscription.add(this.rolesService.addRole(this.entityForm.getRawValue())
        .subscribe(() => {
          this.savedEvent.emit(this.entityForm.value);
          this.btnDisabled = false;
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 500);
        }, error => {
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 500);
        }));
    }
  }

}
