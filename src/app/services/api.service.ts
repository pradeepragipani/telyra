import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EncryptDecryptService } from './encrypt-decrypt.service';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    date = new Date();

    constructor(
        private http: HttpClient,
        private encryptDecryptService: EncryptDecryptService
    ) { }

    getData(endpoint: string): Observable<any> {
        const datePipe = new DatePipe('en_US');
        const header = datePipe.transform(this.date, 'yyyy-MM-dd') + ' 12:23:45.666';
        const encryHeader = 'Bearer ' + this.encryptDecryptService.set(header);
        let headers = {
            authorization: encryHeader,
        };
        return this.http.get(`${environment.apiUrl}/${endpoint}`, { headers });
    }

    postData(endpoint: string, data: any): Observable<any> {
        const datePipe = new DatePipe('en_US');
        const header = datePipe.transform(this.date, 'yyyy-MM-dd') + ' 12:23:45.666';
        const encryHeader = 'Bearer ' + this.encryptDecryptService.set(header);
        let headers = {
            authorization: encryHeader,
        };
        return this.http.post(`${environment.apiUrl}/${endpoint}`, data, { headers });
    }

    postDataWithHeaders(endpoint: string, data: any, headers: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/${endpoint}`, data, { headers });
    }

    // Add more methods as needed
}