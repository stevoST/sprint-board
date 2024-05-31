import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Story} from "../models/story.model";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:8080/v1/stories'

  constructor(private http: HttpClient) {
  }

  getPosts(): Observable<Story[]> {
    console.log(this.http.get<Story[]>(this.apiUrl))
    return this.http.get<Story[]>(this.apiUrl);
  }

}
