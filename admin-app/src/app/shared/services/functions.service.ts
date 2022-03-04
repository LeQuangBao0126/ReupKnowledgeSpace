import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { CommandAssign, User } from '../models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FunctionsService extends BaseService {
    private httpOptions = {
             headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
    }
    constructor(private http: HttpClient, private authService : AuthService) {
        super();
    }
    add(entity: Function) {
        return this.http.post(`${environment.apiUrl}/api/functions`, JSON.stringify(entity), this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    update(id: string, entity: Function) {
        return this.http.put(`${environment.apiUrl}/api/functions/${id}`, JSON.stringify(entity), this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    getDetail(id) {
        return this.http.get<Function>(`${environment.apiUrl}/api/functions/${id}`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    delete(id) {
        return this.http.delete(environment.apiUrl + '/api/functions/' + id, this.httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }
    getAll() {
        return this.http.get<Function[]>(`${environment.apiUrl}/api/functions`, this.httpOptions)
            .pipe(map((response: Function[]) => { return response;}), catchError(this.handleError));
    }
    getAllCommandsByFunctionId(functionId : string ){
        return this.http.get<Function[]>(`${environment.apiUrl}/api/functions/${functionId}/commands`,this.httpOptions)
        .pipe(map((response: Function[]) => {
            return response;
        }), catchError(this.handleError));
    }
    addCommandsToFunction(functionId:string , entity : CommandAssign){
        return this.http.post(`${environment.apiUrl}/api/functions/${functionId}/commands`,JSON.stringify(entity),this.httpOptions)
        .pipe(map((response: Function[]) => {
            return response;
        }), catchError(this.handleError));
    }
}