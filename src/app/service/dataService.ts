import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Status, Story} from "../models/story.model";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:8080/v1'

  constructor(private http: HttpClient) {
  }

  getStories(): Observable<Story[]> {
    return this.http.get<Story[]>(this.apiUrl + '/stories');
  }

  updateStory(story: Story): Observable<Story> {
      const statusEnumMap: { [key in Status]: string } = {
        [Status.OPEN]: 'OPEN',
        [Status.READY]: 'READY',
        [Status.IMPLEMENTATION]: 'IMPLEMENTATION',
        [Status.DONE]: 'DONE'
      }

    const serializedStory = {
      ...story,
      storyState: statusEnumMap[story.storyState]
    }
    return this.http.post<Story>(this.apiUrl + '/story', serializedStory)
  }

}
