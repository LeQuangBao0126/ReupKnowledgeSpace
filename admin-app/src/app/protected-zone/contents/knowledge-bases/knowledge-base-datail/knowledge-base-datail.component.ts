import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '@app/shared/services';
import { KnowledgeBasesService } from '@app/shared/services/knowledge-bases.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { SelectItem } from 'primeng/api/selectitem';
import { Subscription } from 'rxjs/internal/Subscription';
import { environment } from '@environments/environment';
import { Category } from '@app/shared/models';
@Component({
  selector: 'app-knowledge-base-datail',
  templateUrl: './knowledge-base-datail.component.html',
  styleUrls: ['./knowledge-base-datail.component.scss']
})
export class KnowledgeBaseDatailComponent implements OnInit {

  constructor(
    private knowledgeBasesService: KnowledgeBasesService,
    private categoriesService: CategoriesService,
    private utilitiesService: UtilitiesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) {
  }
  private subscription: Subscription[] = [];
  public entityForm: FormGroup;
  public dialogTitle: string;
  public entityId: string;
  public categories: SelectItem[] = [];
  public blockedPanel = false;
  public selectedFiles: File[] = [];
  public attachments: any[] = [];
  public backendApiUrl = environment.apiUrl;

  // validate
  validation_messages = {
    'title': [
      { type: 'required', message: 'Trường này bắt buộc' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 30 kí tự' }
    ],
    'categoryId': [
      { type: 'required', message: 'Trường này bắt buộc' },
    ],
    'seoAlias': [
      { type: 'required', message: 'Trường này bắt buộc' },
    ]
  };
  ngOnInit(): void {
    //console.log(this.route.params.subscribe(data=> console.log(data)))
    this.entityForm = this.fb.group({
      'categoryId': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'title': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'seoAlias': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'description': new FormControl(''),
      'environment': new FormControl(''),
      'problem': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'stepToReproduce': new FormControl(''),
      'errorMessage': new FormControl(''),
      'workaround': new FormControl(''),
      'note': new FormControl(''),
      'labels': new FormControl('')
    });

    this.subscription.push(this.activeRoute.params.subscribe(params => {
      this.entityId = params['id'];
    }));
    this.subscription.push(this.categoriesService.getAll()
      .subscribe((response: Category[]) => {
        response.forEach(element => {
          this.categories.push({ label: element.name, value: element.id });
        });

        if (this.entityId) {
          this.loadFormDetails(this.entityId);
          this.dialogTitle = 'Cập nhật';
        } else {
          this.dialogTitle = 'Thêm mới';
        }
      }));


  }
  private loadFormDetails(id: any) {
    this.blockedPanel = true;
    this.subscription.push(this.knowledgeBasesService.getDetail(id).subscribe((response: any) => {
      this.entityForm.setValue({
        title: response.title,
        categoryId: response.categoryId,
        seoAlias: response.seoAlias,
        description: response.description,
        environment: response.environment,
        problem: response.problem,
        stepToReproduce: response.stepToReproduce,
        errorMessage: response.errorMessage,
        workaround: response.workaround,
        note: response.note,
        labels: response.labels
      });
      this.attachments = response.attachments;
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }, error => {
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }));
  }
  goBackToList() {
    this.router.navigateByUrl('/contents/kbs');
  }
  generateSeoAlias(){
     let seoAlias= this.utilitiesService.MakeSeoTitle(this.entityForm.controls['title'].value);
     this.entityForm.controls['seoAlias'].setValue(seoAlias);
  }
  public saveChange() {
    this.blockedPanel = true;
    const formValues = this.entityForm.getRawValue();
    const formData = this.utilitiesService.ToFormData(formValues);
    console.log(formValues)
    if(this.entityId){
      //update
    }else{
      //add
      this.subscription.push(this.knowledgeBasesService.add(formData).subscribe(response=>{
          console.log(response);
      }))
    }
  }
  removeAttachments(e){
    console.log(e);
    
  }
  selectAttachments(e){
    // this.attachments = e.currentFiles;
    //console.log(this.attachments);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(element => {
      element.unsubscribe();
    });
  }
}
