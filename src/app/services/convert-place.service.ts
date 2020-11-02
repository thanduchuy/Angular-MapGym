import { Injectable } from '@angular/core';
import { Observable, observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class ConvertPlaceService {
  private key = "561beb04448a4192b448c59486e3e2c4";
  private url = "https://api.opencagedata.com/geocode/v1/json"

  constructor(private http: HttpClient) { }

  convertPlace(place: String): any {
    return this.http.get<any>(this.url + "?key=" + this.key + "&q=" + place + "&pretty=1")
  }
}
