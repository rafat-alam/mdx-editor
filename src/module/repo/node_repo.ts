import { and, eq, sql } from "drizzle-orm";
import { dir } from "root/db/schema";
import { _Node } from "../entities/node";
import { getDB } from "root/db";

export class NodeRepo {
  private static async get_database() {
    return await getDB();
  }

  private static async find_nodes(condition: any): Promise<_Node[]> {
    const db = await this.get_database();
    return await db.select().from(dir).where(condition);
  }

  static async add_node(node: _Node): Promise<void> {
    const db = await this.get_database();
    await db.insert(dir).values(node);
  }

  static async get_list(parent_id: string): Promise<_Node[]> {
    return this.find_nodes(eq(dir.parent_id, parent_id));
  }

  static async rename(node_id: string, new_name: string): Promise<void> {
    const db = await this.get_database();
    await db.update(dir)
      .set({ node_name: new_name })
      .where(eq(dir.node_id, node_id));
  }

  static async save(node_id: string, new_content: string): Promise<void> {
    const db = await this.get_database();
    await db.update(dir)
      .set({ content: new_content })
      .where(eq(dir.node_id, node_id));
  }

  static async is_name_already_present(parent_id: string, new_name: string): Promise<boolean> {
    const nodes = await this.find_nodes(
      and(eq(dir.parent_id, parent_id), sql`LOWER(${dir.node_name}) = LOWER(${new_name})`)
    );
    return nodes.length > 0;
  }

  static async remove_by_node_id(node_id: string): Promise<_Node[]> {
    const db = await this.get_database();
    await db.delete(dir).where(eq(dir.node_id, node_id));
    return this.find_nodes(eq(dir.parent_id, node_id));
  }

  static async is_repo_not_present(node_id: string): Promise<boolean> {
    const nodes = await this.find_nodes(
      and(eq(dir.node_id, node_id), eq(dir.parent_id, dir.owner_id))
    );
    return nodes.length === 0;
  }

  static async get_node(node_id: string): Promise<_Node> {
    const nodes = await this.find_nodes(eq(dir.node_id, node_id));
    return nodes[0];
  }

  static async is_parent_not_folder(node_id: string, user_id: string): Promise<boolean> {
    const nodes = await this.find_nodes(eq(dir.node_id, node_id));
    return nodes.length === 0 || nodes[0].node_type === "FILE" || nodes[0].owner_id !== user_id;
  }

  static async is_file_present(node_id: string, user_id: string): Promise<boolean> {
    const nodes = await this.find_nodes(eq(dir.node_id, node_id));
    return nodes.length === 0 || nodes[0].node_type === "FOLDER" || nodes[0].owner_id !== user_id;
  }

  static async get_repo_list(user_id: string): Promise<_Node[]> {
    return this.find_nodes(
      and(eq(dir.parent_id, user_id), eq(dir.owner_id, dir.parent_id))
    );
  }

  static async get_folder_list(folder_id: string): Promise<_Node[]> {
    return this.find_nodes(eq(dir.parent_id, folder_id));
  }

  static async get_public_repo_list(user_id: string): Promise<_Node[]> {
    return this.find_nodes(
      and(
        eq(dir.parent_id, user_id),
        eq(dir.owner_id, dir.parent_id),
        eq(dir.is_public, true)
      )
    );
  }

  static async is_repo_owner(repo_id: string, user_id: string): Promise<boolean> {
    const nodes = await this.find_nodes(
      and(eq(dir.node_id, repo_id), eq(dir.parent_id, user_id))
    );
    return nodes.length === 0;
  }

  static async set_repo_visibility(repo_id: string, is_public: boolean): Promise<void> {
    const db = await this.get_database();
    await db.update(dir)
      .set({ is_public })
      .where(eq(dir.node_id, repo_id));
  }

  static async update_timestamp(node_id: string): Promise<void> {
    const db = await this.get_database();
    await db.update(dir)
      .set({ last_updated: new Date() })
      .where(eq(dir.node_id, node_id));
  }

  static async get_all_public_repos(): Promise<_Node[]> {
    return this.find_nodes(
      and(eq(dir.owner_id, dir.parent_id), eq(dir.is_public, true))
    );
  }
}
