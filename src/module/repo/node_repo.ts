import { and, eq } from "drizzle-orm";
import { dir } from "root/db/schema";
import { _Node } from "../entities/node";
import { getDB } from "root/db";

export class NodeRepo {
  static async add_node(node: _Node): Promise<any> {
    const db = await getDB();
    await db.insert(dir).values(node);
  }

  static async get_list(parent_id: string): Promise<_Node []> {
    const db = await getDB();
    const res: _Node [] = await db.select().from(dir).where(eq(dir.parent_id, parent_id));

    return res;
  }

  static async rename(node_id: string, new_name: string): Promise<any> {
    const db = await getDB();
    await db.update(dir).set({ node_name : new_name }).where(eq(dir.node_id, node_id));
  }

  static async save(node_id: string, new_content: string): Promise<any> {
    const db = await getDB();
    await db.update(dir).set({ content : new_content }).where(eq(dir.node_id, node_id));
  }

  static async is_name_already_present(parent_id: string, new_name: string): Promise<boolean> {
    const db = await getDB();
    const res: _Node [] = await db.select().from(dir).where(and(eq(dir.parent_id, parent_id), eq(dir.node_name, new_name)));

    return res.length > 0;
  }

  static async remove_by_node_id(node_id: string): Promise<_Node []> {
    const db = await getDB();
    await db.delete(dir).where(eq(dir.node_id, node_id));

    const res: _Node [] = await db.select().from(dir).where(eq(dir.parent_id, node_id));
    return res;
  }

  static async is_repo_not_present(node_id: string): Promise<boolean> {
    const db = await getDB();
    const res: _Node [] = await db.select().from(dir).where(and(eq(dir.node_id, node_id), eq(dir.parent_id, dir.owner_id)));

    return res.length == 0;
  }

  static async get_node(node_id: string): Promise<_Node> {
    const db = await getDB();
    const res: _Node [] = await db.select().from(dir).where(eq(dir.node_id, node_id));

    return res[0];
  }

  static async is_parent_not_folder(node_id: string, user_id: string): Promise<boolean> {
    const db = await getDB();
    const res: _Node [] = await db.select().from(dir).where(eq(dir.node_id, node_id));

    return res.length == 0 || res[0].node_type == "FILE" || res[0].owner_id != user_id;
  }

  static async is_file_present(node_id: string, user_id: string): Promise<boolean> {
    const db = await getDB();
    const res: _Node [] = await db.select().from(dir).where(eq(dir.node_id, node_id));

    return res.length == 0 || res[0].node_type == "FOLDER" || res[0].owner_id != user_id;
  }

  static async get_repo_list(user_id: string): Promise<_Node []> {
    const db = await getDB();
    const res: _Node [] = await db.select().from(dir).where(and(eq(dir.parent_id, user_id), eq(dir.owner_id, dir.parent_id)));

    return res;
  }

  static async get_folder_list(folder_id: string): Promise<_Node []> {
    const db = await getDB();
    const res: _Node [] = await db.select().from(dir).where(and(eq(dir.parent_id, folder_id)));

    return res;
  }

  static async get_public_repo_list(user_id: string): Promise<_Node []> {
    const db = await getDB();
    const res: _Node [] = await db.select().from(dir)
      .where(and(eq(dir.parent_id, user_id), eq(dir.owner_id, dir.parent_id), eq(dir.is_public, true)));

    return res;
  }

  static async is_repo_owner(repo_id: string, user_id: string): Promise<boolean> {
    const db = await getDB();
    const res: _Node [] = await db.select().from(dir).where(and(eq(dir.node_id, repo_id), eq(dir.parent_id, user_id)));

    return res.length == 0;
  }

  static async set_repo_vis(repo_id: string, vis: boolean): Promise<any> {
    const db = await getDB();
    await db.update(dir).set({ is_public: vis }).where(eq(dir.node_id, repo_id));
  }

  static async update_time(node_id: string): Promise<any> {
    const db = await getDB();
    await db.update(dir).set({ last_updated : new Date() }).where(eq(dir.node_id, node_id));
  }

  static async get_all_public_repo(): Promise<_Node []> {
    const db = await getDB();
    const res: _Node [] = await db.select().from(dir)
      .where(and(eq(dir.owner_id, dir.parent_id), eq(dir.is_public, true)));

    return res;
  }
}