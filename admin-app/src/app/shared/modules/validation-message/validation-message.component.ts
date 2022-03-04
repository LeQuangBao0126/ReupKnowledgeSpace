import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss']
})
export class ValidationMessageComponent implements OnInit {
  @Input() entityForm : FormGroup;
  @Input() fieldName : FormGroup;
  @Input() validationMessages : any;

  constructor() { }
  ngOnChanges( ): void {
      console.log("changes",this.entityForm.controls);    
  }
  ngOnInit(): void {
     // console.log(this.entityForm.controls)
  }

}
