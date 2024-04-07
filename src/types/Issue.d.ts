import { User, Reactions } from "@/types/User";

export type Label = {
  id: number;
  name: string;
  description: string;
  color: string;
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