import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Command } from '../models';


@Injectable({ providedIn: 'root' })
export class CommandsService extends BaseService {
    private httpOptions = {
             headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
    }
    constructor(private http: HttpClient) {
        super();
    }
    
    getAll(){
        return this.http.get<Command[]>(`${environment.apiUrl}/api/commands`, this.httpOptions)
        .pipe(map((response: Command[]) => { return response;}), catchError(this.handleError));
    }
}