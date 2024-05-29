export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  role: "admin" | "user";
  userId: string;
  user: {
    email: string;
    name: string;
  };
}
