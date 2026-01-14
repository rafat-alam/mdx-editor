import { _Node } from "../entities/node";
import { NodeRepo } from "../repo/node_repo";
import { v4 } from "uuid";

interface Response {
  status: number;
  message: string;
}

interface ResponseRepo {
  status: number;
  message: string;
  list: null | any;
}

interface ResponseList {
  status: number;
  message: string;
  list: _Node[] | null;
}

const INTERNAL_SERVER_ERROR = "INTERNAL SERVER ERROR!";
const SUCCESS = "OK!";
const ACCESS_FORBIDDEN = "Access Forbidden!";
const PAGE_NOT_FOUND = "Page Not Found!";

export class NodeService {
  private static async validate_parent_folder(parent_id: string, user_id: string): Promise<Response | null> {
    if (await NodeRepo.is_parent_not_folder(parent_id, user_id)) {
      return { status: 403, message: ACCESS_FORBIDDEN };
    }
    return null;
  }

  private static async validate_name_uniqueness(parent_id: string, node_name: string, error_message: string): Promise<Response | null> {
    if (await NodeRepo.is_name_already_present(parent_id, node_name)) {
      return { status: 400, message: error_message };
    }
    return null;
  }

  static async add_repo(node_name: string, user_id: string): Promise<Response> {
    try {
      const name_error = await this.validate_name_uniqueness(
        user_id,
        node_name,
        'Repo with same name already present!'
      );
      if (name_error) return name_error;

      const node_id = v4();
      const node = new _Node(node_id, node_name, 'FOLDER', false, null, user_id, user_id);
      await NodeRepo.add_node(node);
      
      return { status: 200, message: SUCCESS };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async add_folder(node_name: string, user_id: string, parent_id: string): Promise<Response> {
    try {
      const parent_error = await this.validate_parent_folder(parent_id, user_id);
      if (parent_error) return parent_error;

      const name_error = await this.validate_name_uniqueness(
        parent_id,
        node_name,
        'File or folder with same name already present!'
      );
      if (name_error) return name_error;

      const node_id = v4();
      const node = new _Node(node_id, node_name, 'FOLDER', null, null, user_id, parent_id);
      await NodeRepo.add_node(node);
      
      return { status: 200, message: SUCCESS };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async add_file(node_name: string, content: string, user_id: string, parent_id: string): Promise<Response> {
    try {
      const parent_error = await this.validate_parent_folder(parent_id, user_id);
      if (parent_error) return parent_error;

      const name_error = await this.validate_name_uniqueness(
        parent_id,
        node_name,
        'File or folder with same name already present!'
      );
      if (name_error) return name_error;

      const node_id = v4();
      const node = new _Node(node_id, node_name, 'FILE', null, content, user_id, parent_id);
      await NodeRepo.add_node(node);
      
      return { status: 200, message: SUCCESS };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async rename_repo(repo_id: string, new_name: string, user_id: string): Promise<Response> {
    try {
      if (await NodeRepo.is_repo_owner(repo_id, user_id)) {
        return { status: 403, message: ACCESS_FORBIDDEN };
      }

      const name_error = await this.validate_name_uniqueness(
        user_id,
        new_name,
        'Repo with same name already present!'
      );
      if (name_error) return name_error;

      await NodeRepo.update_timestamp(repo_id);
      await NodeRepo.rename(repo_id, new_name);

      return { status: 200, message: SUCCESS };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async rename(parent_id: string, node_id: string, new_name: string, user_id: string): Promise<Response> {
    try {
      const parent_error = await this.validate_parent_folder(parent_id, user_id);
      if (parent_error) return parent_error;

      const name_error = await this.validate_name_uniqueness(
        parent_id,
        new_name,
        'File or folder with same name already present!'
      );
      if (name_error) return name_error;

      await NodeRepo.update_timestamp(node_id);
      await NodeRepo.rename(node_id, new_name);

      return { status: 200, message: SUCCESS };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async save(node_id: string, new_content: string, user_id: string): Promise<Response> {
    try {
      if (await NodeRepo.is_file_present(node_id, user_id)) {
        return { status: 403, message: ACCESS_FORBIDDEN };
      }

      await NodeRepo.update_timestamp(node_id);
      await NodeRepo.save(node_id, new_content);

      return { status: 200, message: SUCCESS };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async remove(node_id: string, user_id: string): Promise<Response> {
    try {
      const node = await NodeRepo.get_node(node_id);

      if (node.owner_id !== user_id) {
        return { status: 403, message: ACCESS_FORBIDDEN };
      }

      let nodes_to_delete: string[] = [node_id];
      
      while (nodes_to_delete.length > 0) {
        const children_to_delete: string[] = [];
        
        for (const current_node_id of nodes_to_delete) {
          const children = await NodeRepo.remove_by_node_id(current_node_id);
          for (const child of children) {
            children_to_delete.push(child.node_id);
          }
        }
        
        nodes_to_delete = children_to_delete;
      }
      
      return { status: 200, message: SUCCESS };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async set_repo_visibility(repo_id: string, user_id: string, is_public: boolean): Promise<Response> {
    try {
      if (await NodeRepo.is_repo_owner(repo_id, user_id)) {
        return { status: 403, message: ACCESS_FORBIDDEN };
      }
      
      await NodeRepo.update_timestamp(repo_id);
      await NodeRepo.set_repo_visibility(repo_id, is_public);
      
      return { status: 200, message: SUCCESS };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async get_content_by_link(link: string[], owner_id: string, user_id: string): Promise<ResponseList> {
    try {
      let node_list = owner_id === user_id
        ? await NodeRepo.get_repo_list(owner_id)
        : await NodeRepo.get_public_repo_list(owner_id);

      let file_content: string | null = null;

      for (let i = 0; i < link.length; i++) {
        let next_folder_id: string | null = null;
        
        for (const node of node_list) {
          if (node.node_name === link[i]) {
            next_folder_id = node.node_id;
            break;
          }
        }

        if (next_folder_id === null) {
          if (file_content !== null) {
            return { status: 200, message: file_content, list: null };
          }
          return { status: 404, message: PAGE_NOT_FOUND, list: null };
        }

        node_list = await NodeRepo.get_folder_list(next_folder_id);

        if (i < link.length - 1) {
          for (const node of node_list) {
            if (node.node_name === link[i + 1]) {
              file_content = node.content;
              break;
            }
          }
        }
      }

      if (file_content === null) {
        return { status: 200, message: SUCCESS, list: node_list };
      }
      
      return { status: 200, message: file_content, list: null };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR, list: null };
    }
  }

  static async get_node_id_by_link(link: string[], owner_id: string, user_id: string): Promise<Response> {
    try {
      let node_list = owner_id === user_id
        ? await NodeRepo.get_repo_list(owner_id)
        : await NodeRepo.get_public_repo_list(owner_id);

      let parent_id: string = owner_id;

      for (const link_segment of link) {
        let next_folder_id: string | null = null;
        
        for (const node of node_list) {
          if (node.node_name === link_segment) {
            next_folder_id = node.node_id;
            break;
          }
        }

        if (next_folder_id === null) {
          return { status: 404, message: PAGE_NOT_FOUND };
        }

        parent_id = next_folder_id;
        node_list = await NodeRepo.get_folder_list(next_folder_id);
      }

      return { status: 200, message: parent_id };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async get_user_repo_count(owner_id: string, user_id: string): Promise<Response> {
    try {
      const repo_list = owner_id === user_id
        ? await NodeRepo.get_repo_list(owner_id)
        : await NodeRepo.get_public_repo_list(owner_id);

      return { status: 200, message: repo_list.length.toString() };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async get_all_public_repos(): Promise<ResponseList> {
    try {
      const repo_list = await NodeRepo.get_all_public_repos();
      return { status: 200, message: SUCCESS, list: repo_list };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR, list: null };
    }
  }

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

  private static async get_repo(node_id: string, user_id: string): Promise<ResponseRepo> {
    try {
      if(await NodeRepo.is_repo_not_present(node_id)) {
        return { status: 404, message: PAGE_NOT_FOUND, list: null };
      }

      let res: _Node = await NodeRepo.get_node(node_id);

      if(res.is_public == false && res.owner_id != user_id) {
        return { status: 500, message: INTERNAL_SERVER_ERROR, list: null };
      }

      return { status: 200, message: SUCCESS, list: {
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
      return { status: 500, message: INTERNAL_SERVER_ERROR, list: null };
    }
  }
}
