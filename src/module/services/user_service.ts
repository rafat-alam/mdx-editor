import { User } from "../entities/user";
import { UserRepo } from "../repo/user_repo";

const INTERNAL_SERVER_ERROR = "INTERNAL SERVER ERROR!";
const SUCCESS = "OK!";
const USER_NOT_FOUND = "No user found!";

interface Response {
  status: number;
  message: string;
}

interface PublicUserData {
  username: string;
  name: string;
}

interface PrivateUserData extends PublicUserData {
  email: string;
}

interface ResponsePublicUser {
  status: number;
  message: string;
  user: PublicUserData | null;
}

interface ResponseAllUser {
  status: number;
  message: string;
  user_list: { user_id: string; username: string }[] | null;
}

interface ResponsePrivateUser {
  status: number;
  message: string;
  user: PrivateUserData | null;
}

export class UserService {
  private static create_public_user_data(user: User): PublicUserData {
    return {
      username: user.username,
      name: user.name
    };
  }

  private static create_private_user_data(user: User): PrivateUserData {
    return {
      username: user.username,
      name: user.name,
      email: user.email
    };
  }

  static async get_public_user(username: string): Promise<ResponsePublicUser> {
    try {
      const users = await UserRepo.get_user(username);
      
      if (users.length === 0) {
        return { status: 404, message: USER_NOT_FOUND, user: null };
      }

      const user_data = this.create_public_user_data(users[0]);
      return { status: 200, message: SUCCESS, user: user_data };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR, user: null };
    }
  }

  static async get_all_users(): Promise<ResponseAllUser> {
    try {
      const users = await UserRepo.get_all_users();
      
      const user_list = users.map(user => ({
        username: user.username,
        user_id: user.user_id
      }));

      return { status: 200, message: SUCCESS, user_list };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR, user_list: null };
    }
  }

  static async get_private_user(username: string): Promise<ResponsePrivateUser> {
    try {
      const users = await UserRepo.get_user(username);
      
      if (users.length === 0) {
        return { status: 404, message: USER_NOT_FOUND, user: null };
      }

      const user_data = this.create_private_user_data(users[0]);
      return { status: 200, message: SUCCESS, user: user_data };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR, user: null };
    }
  }

  static async get_user_by_id(user_id: string): Promise<ResponsePrivateUser> {
    try {
      const users = await UserRepo.get_user_by_id(user_id);
      
      if (users.length === 0) {
        return { status: 404, message: USER_NOT_FOUND, user: null };
      }

      const user_data = this.create_private_user_data(users[0]);
      return { status: 200, message: SUCCESS, user: user_data };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR, user: null };
    }
  }

  static async get_user_id(username: string): Promise<Response> {
    try {
      const users = await UserRepo.get_user(username);
      
      if (users.length === 0) {
        return { status: 404, message: USER_NOT_FOUND };
      }

      return { status: 200, message: users[0].user_id };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }
}
