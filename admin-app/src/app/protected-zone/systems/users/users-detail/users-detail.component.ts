import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@app/shared/services';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.scss']
})
export class UsersDetailComponent implements OnInit {
  entityId: string;
  entityForm: FormGroup
  savedEvent: EventEmitter<any> = new EventEmitter();
  dialogTitle :string;
  

  constructor(private fb: FormBuilder,
    public  userService : UserService,
    public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.entityForm = this.fb.group({
      'userName': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])),
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
     
      ])),
      'firstName': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])),
      'lastName': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
       ])),
       'dob': new FormControl('', Validators.compose([
        Validators.required
       ])),
       'phoneNumber': new FormControl('')
    });
    if(!this.entityId){
        this.dialogTitle ='Them moi nguoi dung';

    }else{

    }
  }
  saveChange(){

        if(this.entityId){
          //update
        }else{
          console.log('luu');
          this.userService.postUser(this.entityForm.value).subscribe(response=>{
            console.log(response)
          })
        }
  }
}
