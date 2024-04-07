export type User = {
  id: number;
  name: string;
  avatar_url: string;
  home_url: string;
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