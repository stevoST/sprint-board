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
    this.dataService.getStories().subscribe(
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
          columns['Open'].stories.push(story);
          break;
        case Status.READY.toUpperCase():
          columns['Ready'].stories.push(story);
          break;
        case Status.IMPLEMENTATION.toUpperCase():
          columns['Implementation'].stories.push(story);
          break;
        case Status.DONE.toUpperCase():
          columns['Done'].stories.push(story);
          break;
      }
    })

    return new Board('Story Board', Object.values(columns));
  }

  drop(event: CdkDragDrop<Story[]>, columnName: String) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const story = event.container.data[event.currentIndex];
      story.storyState = this.getStateFromString(columnName);
      this.dataService.updateStory(story).subscribe(
        updatedStory => {
          console.log('Story updated', story)
        },
        error => {
          console.error('Error updating story', story)
        }
      );
    }
  }

  private getStateFromString(columnName: String): Status {
    switch (columnName) {
      case 'Open':
        return Status.OPEN;
      case 'Ready':
        return Status.READY;
      case 'Implementation':
        return Status.IMPLEMENTATION;
      case 'Done':
        return Status.DONE;
      default:
        throw new Error('Unknown column name: ${columnName}');
    }
  }
}
