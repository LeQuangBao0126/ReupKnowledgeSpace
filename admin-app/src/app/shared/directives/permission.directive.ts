import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthService } from '../services';

@Directive({
    selector: '[appPermission]'
})
export class PermissionDirective implements OnInit {
    @Input() appFunction :string;
    @Input() appAction : string;
     
    constructor(private ef:ElementRef ,private authService: AuthService ) {
        console.log("directive");
    }
    ngOnInit(): void {
        const loggerUser =this.authService.isAuthenticated();
        if(loggerUser){
            const permissions = JSON.parse(this.authService.profile.Permissions);
            if(permissions && permissions.filter(x=>x == this.appFunction+"_"+this.appAction).length > 0){
                    this.ef.nativeElement.style.display= "";
            }else{
                this.ef.nativeElement.style.display= "none";
            }
        }else{
            this.ef.nativeElement.style.display= "none";
        }
    }
 }