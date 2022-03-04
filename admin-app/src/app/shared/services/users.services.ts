import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { catchError,map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Role, User } from '../models';
import { UtilitiesService } from './utilities.service';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }
    constructor(private http: HttpClient, private utilitiesService: UtilitiesService) {
        super();
    }
    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/users`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }
    getMenuByUser(userId: string) {
        return this.http.get<Function[]>(`${environment.apiUrl}/api/users/${userId}/menu`, this.httpOptions)
            .pipe(map(response => {
                const functions = this.utilitiesService.UnflatteringForLeftMenu(response);
                return functions;
            }), catchError(this.handleError));
    }
    getUserPaging(keyword,pageIndex ,pageSize){
        return this.http.get<User[]>(`${environment.apiUrl}/api/users/filter?pageIndex=${pageIndex}&pageSize=${pageSize}&filter=${keyword}`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }
    postUser(userEntity : User){
        return this.http.post(`${environment.apiUrl}/api/users`,JSON.stringify(userEntity), this.httpOptions)
            .pipe(catchError(this.handleError));
    }
    putUser(userId:string ,userEntity : User){
        return this.http.post(`${environment.apiUrl}/api/users/${userId}`,JSON.stringify(userEntity), this.httpOptions)
            .pipe(catchError(this.handleError));
    }
    deleteUser(userId:string){
        return this.http.delete(`${environment.apiUrl}/api/users/${userId}`, this.httpOptions).pipe(catchError(this.handleError));
    }
    getRolesByUserId(userId:string){
        return this.http.get<Role[]>(`${environment.apiUrl}/api/users/${userId}/roles`, this.httpOptions).pipe(catchError(this.handleError));
    }
}