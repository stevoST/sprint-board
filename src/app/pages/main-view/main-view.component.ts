import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';
import {Board} from "../../models/board.model";
import {Column} from "../../models/column.model";
import {DataService} from "../../service/dataService";
import {Status, Story} from "../../models/story.model";

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit{
  stories: Story[] = [];

  constructor(private dataService: DataService) {
    console.log(this.stories)
  }

  ngOnInit(): void {
    this.dataService.getPosts().subscribe(
      (data) => {
        this.stories = data.map(story => ({
          ...story,
        }));
    console.log(this.stories)
      },
      error => {
        console.error('Error fetching stories', error)
      }
    );
  }

  board: Board = new Board('Test Board', [
    new Column('Open', [
      'Some random idea',
      'Intellij idea',
      'Not a great idea'
    ]),
    new Column('Ready', [
      'Refined story',
      'Intellij refined story',
      'Ultra turbo refined story'
    ]),
    new Column('Implementation', [
      'Get to work',
      'Pick up groceries',
      'Go home',
      'Fall asleep'
    ]),
    new Column('Done', [
      'Get up',
      'Brush teeth',
      'Take a shower',
      'Check e-mail',
      'Walk dog'
    ]),
  ])

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
