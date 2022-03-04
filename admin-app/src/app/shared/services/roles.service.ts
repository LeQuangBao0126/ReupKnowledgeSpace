import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { catchError,map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Role } from '../models/role.model';
import { Pagination } from '../models/pagination.model';

@Injectable({ providedIn: 'root' })
export class RolesService extends BaseService {
    private httpOptions = {
        headers: new HttpHeaders({
           'Content-Type': 'application/json'
       })
}
    constructor(private http: HttpClient) {
        super();
    }

    getAll() {
        return this.http.get<Role[]>(`${environment.apiUrl}/api/roles`,this.httpOptions).pipe(catchError(this.handleError));
    }
    getAllPaging(filter, pageIndex, pageSize) {
        return this.http.get<Pagination<Role>>(`${environment.apiUrl}/api/roles/paging?pageIndex=${pageIndex}&pageSize=${pageSize}&filter=${filter}`, 
        this.httpOptions)
            .pipe(map((response: Pagination<Role>) => {
                return response;
            }), catchError(this.handleError));
    }
    addRole(roleEntity : Role){
        return this.http.post(`${environment.apiUrl}/api/roles`,JSON.stringify(roleEntity),this.httpOptions).pipe(catchError(this.handleError));
    }
    updateRole(roleId :string ,roleEntity : Role){
        return this.http.put(`${environment.apiUrl}/api/roles/${roleId}`,JSON.stringify(roleEntity),this.httpOptions).pipe(catchError(this.handleError));
    }
    deleteRole(roleId : string){
        return this.http.delete(`${environment.apiUrl}/api/roles/${roleId}`,this.httpOptions).pipe(catchError(this.handleError));
    }
    getDetail(roleId :string){
        return this.http.get<Role[]>(`${environment.apiUrl}/api/roles/${roleId}`,this.httpOptions).pipe(catchError(this.handleError));
    }
    getPermissionByRoleId(roleId:string){
        return this.http.get<any>(`${environment.apiUrl}/api/roles/${roleId}/permissions`,this.httpOptions).pipe(catchError(this.handleError));
    }
}