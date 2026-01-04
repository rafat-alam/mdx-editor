import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable('user', {
  user_id: text('user_id').notNull().unique().primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
});

export const nodeTypeEnum = pgEnum('node', ["FILE", "FOLDER"]);

export const dir = pgTable('dir', {
  node_id: text('node_id').notNull().unique().primaryKey(),
  node_name: text('node_name').notNull(),
  node_type: nodeTypeEnum('node_type').notNull(),
  is_public: boolean('is_public'),
  content: text('content'),
  owner_id: text('owner_id').notNull(),
  parent_id: text('parent_id').notNull(),
  last_updated: timestamp('last_updated', { withTimezone: true }).defaultNow().notNull(),
});

// npx drizzle-kit generate
// npx drizzle-kit migrate