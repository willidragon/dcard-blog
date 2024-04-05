export type User = {
  id: number;
  name: string;
  avatar_url: string;
  home_url: string;
}

export type Label = {
  id: number;
  name: string;
  description: string;
  color: string;
}

export type Reactions = {
  '+1': number;
  '-1': number;
  confused: number;
  eyes: number;
  heart: number;
  hooray: number;
  laugh: number;
  rocket: number;
  total_count: number;
}

export type Issue = {
  id: number;
  number: number;
  title: string;
  body: string;
  labels: Array<Label>;
  state: string;
  user: User;
  reactions: Reactions;
  created_at: Date;
  updated_at: Date;
  url: string;
};