import { User } from "../entities/user";
import { UserRepo } from "../repo/user_repo";

const iserror: string = "INTERNAL SERVER ERROR!";
const success: string = "OK!";

interface Response {
  status: number;
  message: string;
}

interface ResponsePublicUser {
  status: number;
  message: string;
  user: null | {
    username: string;
    name: string;
  };
}

interface ResponsePrivateUser {
  status: number;
  message: string;
  user: null | {
    username: string;
    name: string;
    email: string;
  };
}

export class UserService {
  static async get_public_user(username: string): Promise<ResponsePublicUser> {
    try {
      const user: User [] = await UserRepo.get_user(username);
      if(user.length) {
        return { status: 200, message: success, user: { 
          username: user[0].username,
          name: user[0].name,
        }};
      }
      return { status: 400, message: 'No user found!', user: null };
    } catch {
      return { status: 500, message: iserror, user: null };
    }
  }

  static async get_private_user(username: string): Promise<ResponsePrivateUser> {
    try {
      const user: User [] = await UserRepo.get_user(username);
      if(user.length) {
        return { status: 200, message: success, user: { 
          username: user[0].username,
          name: user[0].name,
          email: user[0].email,
        }};
      }
      return { status: 400, message: 'No user found!', user: null };
    } catch {
      return { status: 500, message: iserror, user: null };
    }
  }

  static async get_user_by_id(user_id: string): Promise<ResponsePrivateUser> {
    try {
      const user: User [] = await UserRepo.get_user_by_id(user_id);
      if(user.length) {
        return { status: 200, message: success, user: { 
          username: user[0].username,
          name: user[0].name,
          email: user[0].email,
        }};
      }
      return { status: 400, message: 'No user found!', user: null };
    } catch {
      return { status: 500, message: iserror, user: null };
    }
  }

  static async get_user_id(username: string): Promise<Response> {
    try {
      const user: User [] = await UserRepo.get_user(username);
      if(user.length) {
        return { status: 200, message: user[0].user_id };
      }
      return { status: 400, message: 'No user found!' };
    } catch {
      return { status: 500, message: iserror };
    }
  }
}