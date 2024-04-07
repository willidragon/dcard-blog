import { User, Reactions } from "@/types/User";

export type Comment = {
  id: number;
  body: string;
  user: User;
  reactions: Reactions;
  created_at: Date;
  updated_at: Date;
  url: string;
};