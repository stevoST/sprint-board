import {Story} from "./story.model";

export class Column {
  constructor(public name: string, public stories: Story[]) {
  }
}
