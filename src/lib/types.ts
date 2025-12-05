export type Executive = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  imageHint: string;
};

export type User = {
  name: string;
  avatar: string;
};

export type ForumPost = {
  id: string;
  author: User;
  timestamp: string;
  content: string;
};

export type ForumThread = {
  id: string;
  title: string;
  author: User;
  replies: number;
  lastActivity: string;
  posts: ForumPost[];
};
