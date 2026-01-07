import { _Node } from "../entities/node";
import { NodeRepo } from "../repo/node_repo";
import { v4 } from "uuid";

interface Response {
  status: number;
  message: string;
}

// Depricated
interface ResponseRepo {
  status: number;
  message: string;
  list: null | any;
}

interface ResponseList {
  status: number;
  message: string;
  list: null | _Node [];
}

const iserror: string = "INTERNAL SERVER ERROR!";
const success: string = "OK!";

export class NodeService {
  static async add_repo(node_name: string, user_id: string): Promise<Response> {
    try {
      if(await NodeRepo.is_name_already_present(user_id, node_name)) {
        return { status: 400, message: 'Repo with same name already Present!' };
      }

      const node_id = v4();
      const node = new _Node(node_id, node_name, 'FOLDER', false, null, user_id, user_id);
      await NodeRepo.add_node(node);
      return { status: 200, message: success };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async add_folder(node_name: string, user_id: string, parent_id: string): Promise<Response> {
    try {
      if(await NodeRepo.is_parent_not_folder(parent_id, user_id)) {
        return { status: 500, message: iserror };
      }

      if(await NodeRepo.is_name_already_present(parent_id, node_name)) {
        return { status: 400, message: 'File or Folder with same name already Present!' };
      }

      const node_id = v4();
      const node = new _Node(node_id, node_name, 'FOLDER', null, null, user_id, parent_id);
      await NodeRepo.add_node(node);
      return { status: 200, message: success };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async add_file(node_name: string, content: string, user_id: string, parent_id: string): Promise<Response> {
    try {
      if(await NodeRepo.is_parent_not_folder(parent_id, user_id)) {
        return { status: 500, message: iserror };
      }

      if(await NodeRepo.is_name_already_present(parent_id, node_name)) {
        return { status: 400, message: 'File or Folder with same name already Present!' };
      }

      const node_id = v4();
      const node = new _Node(node_id, node_name, 'FILE', null, content, user_id, parent_id);
      await NodeRepo.add_node(node);
      return { status: 200, message: success };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  // Deprecated
  private static async get_node_list(node_id: string) {
    const li: _Node [] = await NodeRepo.get_list(node_id);

    let res: any = [];

    for(const l of li) {
      let list: any = {
        _id: l.node_id,
        name: l.node_name,
        checked: 0,
        isOpen: false,
        node_type: l.node_type,
        is_public: l.is_public,
        content: l.content,
        owner_id: l.owner_id,
        parent_id: l.parent_id,
        last_updated: l.last_updated,
        children: await this.get_node_list(l.node_id),
      };

      res.push(list);
    }

    return res;
  }

  // Deprecated
  private static async get_repo(node_id: string, user_id: string): Promise<ResponseRepo> {
    try {
      if(await NodeRepo.is_repo_not_present(node_id)) {
        return { status: 500, message: iserror, list: null };
      }

      let res: _Node = await NodeRepo.get_node(node_id);

      if(res.is_public == false && res.owner_id != user_id) {
        return { status: 500, message: iserror, list: null };
      }

      return { status: 200, message: success, list: {
          _id: res.node_id,
          name: res.node_name,
          checked: 0,
          isOpen: false,
          node_type: res.node_type,
          is_public: res.is_public,
          content: res.content,
          owner_id: res.owner_id,
          parent_id: res.parent_id,
          last_updated: res.last_updated,
          children: await this.get_node_list(res.node_id),
        }
      };
    } catch {
      return { status: 500, message: iserror, list: null };
    }
  }

  static async rename_repo(repo_id: string, new_name: string, user_id: string): Promise<Response> {
    try {
      if(await NodeRepo.is_repo_owner(repo_id, user_id)) {
        return { status: 500, message: iserror };
      }
      if(await NodeRepo.is_name_already_present(user_id, new_name)) {
        return { status: 400, message: 'Repo with same name already Present!' };
      }

      await NodeRepo.update_time(repo_id);
      await NodeRepo.rename(repo_id, new_name);

      return { status: 200, message: success };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async rename(parent_id: string, node_id: string, new_name: string, user_id: string): Promise<Response> {
    try {
      if(await NodeRepo.is_parent_not_folder(parent_id, user_id)) {
        return { status: 500, message: iserror };
      }

      if(await NodeRepo.is_name_already_present(parent_id, new_name)) {
        return { status: 400, message: 'File or Folder with same name already Present!' };
      }

      await NodeRepo.update_time(node_id);
      await NodeRepo.rename(node_id, new_name);

      return { status: 200, message: success };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async save(node_id: string, new_content: string, user_id: string): Promise<Response> {
    try {
      if(await NodeRepo.is_file_present(node_id, user_id)) {
        return { status: 500, message: iserror };
      }

      await NodeRepo.update_time(node_id);
      await NodeRepo.save(node_id, new_content);

      return { status: 200, message: success };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async remove(node_id: string, user_id: string): Promise<Response> {
    try {
      let res: _Node = await NodeRepo.get_node(node_id);

      if(res.owner_id != user_id) {
        return { status: 500, message: iserror };
      }

      let list: string [] = [node_id];
      while(list.length) {
        let temp: string [] = [];
        for (const l of list) {
          let curr: _Node [] = await NodeRepo.remove_by_node_id(l);
          for (const e of curr) {
            temp.push(e.node_id);
          }
        }
        list = temp;
      }
      return { status: 200, message: success };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  // Deprecated
  private static async get_repo_list(owner_id: string, user_id: string): Promise<ResponseList> {
    try {
      if(owner_id == user_id) {
        return { status: 200, message: success, list: await NodeRepo.get_repo_list(owner_id) };
      } else {
        return { status: 200, message: success, list: await NodeRepo.get_public_repo_list(owner_id) };
      }
    } catch {
      return { status: 500, message: iserror, list: null };
    }
  }

  static async set_repo_vis(repo_id: string, user_id: string, vis: boolean): Promise<Response> {
    try {
      if(await NodeRepo.is_repo_owner(repo_id, user_id)) {
        return { status: 500, message: iserror };
      }
      await NodeRepo.update_time(repo_id);
      await NodeRepo.set_repo_vis(repo_id, vis);
      return { status: 200, message: success };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async get_content_by_link(link: string [], owner_id: string, user_id: string): Promise<ResponseList> {
    try {
      let list: _Node [] = await NodeRepo.get_repo_list(owner_id);
      if(owner_id == user_id) {
        list = await NodeRepo.get_repo_list(owner_id);
      } else {
        list = await NodeRepo.get_public_repo_list(owner_id);
      }
      
      let content: null | string = null;

      for(let i = 0; i < link.length; i++) {
        let next_folder_id: null | string = null;
        for(const dir of list) {
          if(dir.node_name == link[i]) {
            next_folder_id = dir.node_id;
          }
        }

        if(next_folder_id == null) {
          if(content != null) {
            return { status: 200, message: content, list: null };
          } else {
            return { status: 400, message: 'Page Not Found!', list: null };
          }
        }

        list = await NodeRepo.get_folder_list(next_folder_id);

        if(i < link.length - 1) {
          for(const li of list) {
            if(li.node_name == link[i + 1]) {
              content = li.content;
            }
          }
        }
      }

      if(content == null) {
        return { status: 200, message: success, list: list };
      } else {
        return { status: 200, message: content, list: null };
      }
    } catch {
      return { status: 500, message: iserror, list: null };
    }
  }

  static async get_node_id_by_link(link: string [], owner_id: string, user_id: string): Promise<Response> {
    try {
      let list: _Node [];
      if(owner_id == user_id) {
        list = await NodeRepo.get_repo_list(owner_id);
      } else {
        list = await NodeRepo.get_public_repo_list(owner_id);
      }
      
      let parent_id: string = owner_id;

      for(const l of link) {
        let next_folder_id: null | string = null;
        for(const dir of list) {
          if(dir.node_name == l) {
            next_folder_id = dir.node_id
          }
        }

        if(next_folder_id == null) {
          return { status: 400, message: 'Page Not Found!' };
        }

        parent_id = next_folder_id;
        list = await NodeRepo.get_folder_list(next_folder_id);
      }

      return { status: 200, message: parent_id };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async user_repo_count(user_id: string): Promise<Response> {
    try {
      return { status: 200, message: (await NodeRepo.get_repo_list(user_id)).length.toString() };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async get_all_public_repo(): Promise<ResponseList> {
    try {
      let list: _Node [] = await NodeRepo.get_all_public_repo();

      return { status: 200, message: success, list: list };
    } catch {
      return { status: 500, message: iserror, list: null };
    }
  }
}
