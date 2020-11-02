import { Injectable } from '@angular/core';
import { Observable, observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators'
import {Search} from '../models/searchMap'


@Injectable({
  providedIn: 'root'
})
export class MapService {

  private url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
  constructor(private http: HttpClient) { }

  findMap(search:Search): any {
    return this.http.get<any>(this.url+"?f="+search.f+"&category="+search.category+"&location="+search.longitude+","+search.latitude+
    "&outFields="+search.outFields+"&maxLocations="+search.maxLocations)
  }
}
