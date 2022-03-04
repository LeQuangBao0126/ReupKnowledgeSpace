import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //luc truoc la đăng nhập rồi cho login là thấy hết,
    //bây giờ đăng nhập rồi nhưng phải có quyền VIEW  mới xem dc các function

    if (this.authService.isAuthenticated()) { 
        const functionCode = route.data['functionCode'] as string;
        const permissions = JSON.parse(this.authService.profile.Permissions);
        if(permissions && permissions.filter(x=> x == functionCode+"_"+"VIEW")){
          return true;
        }
        this.router.navigate(['/access-denied'], { queryParams: { redirect: state.url }, replaceUrl: true });
    }
    this.router.navigate(['/login'], { queryParams: { redirect: state.url }, replaceUrl: true });
    return false;
  }

}