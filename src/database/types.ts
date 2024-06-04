import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Gifs {
  id: Generated<number>;
  url: string;
}

export interface Messages {
  id: Generated<number>;
  sprintId: number;
  templateId: number;
  timeStamp: Generated<string>;
  userId: number;
}

export interface Sprints {
  id: Generated<number>;
  sprintsCode: string;
  title: string;
}

export interface Templates {
  id: Generated<number>;
  text: string;
}

export interface Users {
  id: Generated<number>;
  name: string;
}

export interface DB {
  gifs: Gifs;
  messages: Messages;
  sprints: Sprints;
  templates: Templates;
  users: Users;
}
