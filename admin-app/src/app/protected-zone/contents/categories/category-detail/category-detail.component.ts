import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CategoriesService } from '@app/shared/services';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilitiesService } from '@app/shared/services/utilities.service';
// import { MessageConstants } from '@app/shared/constants';

@Component({
  selector: 'app-categories-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoriesDetailComponent implements OnInit, OnDestroy {

  constructor(
    public bsModalRef: BsModalRef,
    private categoriesService: CategoriesService,
    private utilitiesService: UtilitiesService,
    private fb: FormBuilder) {
  }

  private subscription = new Subscription();
  public entityForm: FormGroup;
  public dialogTitle: string;
  private savedEvent: EventEmitter<any> = new EventEmitter();
  public entityId: string;
  public btnDisabled = false;

  public blockedPanel = false;

  public categories: [];

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

  ngOnInit() {
    this.entityForm = this.fb.group({
      'name': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])),
      'seoAlias': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'seoDescription': new FormControl(''),
      'sortOrder': new FormControl(),
      'parentId': new FormControl(null)
    });
    this.subscription.add(this.categoriesService.getAll()
      .subscribe((response: any) => {
        this.categories = response;
        if (this.entityId) {
          this.dialogTitle = 'Cập nhật';
          this.loadFormDetails(this.entityId);
        } else {
          this.dialogTitle = 'Thêm mới';
        }
      }));
  }
  public generateSeoAlias() {
    const seoAlias = this.utilitiesService.MakeSeoTitle(this.entityForm.controls['name'].value);
    this.entityForm.controls['seoAlias'].setValue(seoAlias);
  }
  private loadFormDetails(id: any) {
    this.blockedPanel = true;
    this.subscription.add(this.categoriesService.getDetail(id).subscribe((response: any) => {
      this.entityForm.setValue({
        name: response.name,
        seoAlias: response.seoAlias,
        seoDescription: response.seoDescription,
        sortOrder: response.sortOrder,
        parentId: response.parentId
      });
      setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
    }, error => {
      setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
    }));
  }
  public saveChange() {
    this.btnDisabled = true;
    this.blockedPanel = true;
    if (this.entityId) {
      this.subscription.add(this.categoriesService.update(this.entityId, this.entityForm.getRawValue())
        .subscribe(() => {
          this.savedEvent.emit(this.entityForm.value);
         // this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
          this.btnDisabled = false;
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
        }, error => {
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
        }));
    } else {
      this.subscription.add(this.categoriesService.add(this.entityForm.getRawValue())
        .subscribe(() => {
          this.savedEvent.emit(this.entityForm.value);
          //this.notificationService.showSuccess(MessageConstants.CREATED_OK_MSG);
          this.btnDisabled = false;
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
        }, error => {
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
        }));
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}