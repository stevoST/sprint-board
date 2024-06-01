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
export class MainViewComponent implements OnInit {
  stories: Story[] = []
  board: Board = new Board('Test Board', [])

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.getPosts().subscribe(
      (data) => {
        this.stories = data.map(story => ({
          ...story,
        }));
        this.board = this.mapResponseToBoard(this.stories);
      },
      error => {
        console.error('Error fetching stories', error)
      }
    );
  }

  private mapResponseToBoard(stories: Story[]): Board {
    const columns: { [key: string]: Column } = {
      'Open': new Column('Open', []),
      'Ready': new Column('Ready', []),
      'Implementation': new Column('Implementation', []),
      'Done': new Column('Done', [])
    }

    stories.forEach(story => {
      switch (story.storyState) {
        case Status.OPEN.toUpperCase():
          columns['Open'].tasks.push(story.title);
          break;
        case Status.READY.toUpperCase():
          columns['Ready'].tasks.push(story.title);
          break;
        case Status.IMPLEMENTATION.toUpperCase():
          columns['Implementation'].tasks.push(story.title);
          break;
        case Status.DONE.toUpperCase():
          columns['Done'].tasks.push(story.title);
          break;
      }
    })

    return new Board('Story Board', Object.values(columns));
  }

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
