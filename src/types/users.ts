export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: Date;
  articlesCount: number;
}