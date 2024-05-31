export enum Status{
  OPEN = "Open",
  READY="Ready",
  IMPLEMENTATION ="Implementation",
  DONE="Done"
}
export interface Story{
  id: number;
  title: string;
  storyState: Status;
}
