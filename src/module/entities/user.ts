export class User {
  user_id: string;
  username: string;
  name: string;
  email: string;
  password_hash: string;

  constructor(user_id: string, username: string, name: string, email: string, password_hash: string) {
    this.user_id = user_id;
    this.username = username;
    this.name = name;
    this.email = email;
    this.password_hash = password_hash;
  }
}