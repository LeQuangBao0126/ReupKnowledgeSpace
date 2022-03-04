import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { PermissionScreen, PermissionUpdate } from '../models';
import { environment } from '@environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PermissionsService extends BaseService {
    private httpOptions = {
        headers: new HttpHeaders({
           'Content-Type': 'application/json'
       })
}
    constructor(private http: HttpClient) {
        super();
    }
    getPermissionScreen(){
        return this.http.get<any>(`${environment.apiUrl}/api/permissions`,this.httpOptions).pipe(catchError(this.handleError));
    }
    save(roleId :String , permissions : PermissionUpdate){
        return this.http.put(`${environment.apiUrl}/api/roles/${roleId}/permissions`,
        JSON.stringify(permissions),this.httpOptions).pipe(catchError(this.handleError));
    }
}