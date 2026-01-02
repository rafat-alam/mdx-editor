export class _Node {
  node_id: string;
  node_name: string;
  node_type: "FILE" | "FOLDER";
  is_public: null | boolean;
  content: null | string;
  owner_id: string;
  parent_id: string;
  last_updated: Date;

  constructor(node_id: string, node_name: string, node_type: "FILE" | "FOLDER",
              is_public: null | boolean, content: null | string, owner_id: string, parent_id: string) {
    this.node_id = node_id;
    this.node_name = node_name;
    this.node_type = node_type;
    this.is_public = is_public;
    this.content = content;
    this.owner_id = owner_id;
    this.parent_id = parent_id;
    this.last_updated = new Date();
  }
}