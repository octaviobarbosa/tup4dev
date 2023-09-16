export interface UserSingIn {
  username: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  scopes: string[];
}
