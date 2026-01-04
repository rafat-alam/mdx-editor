DROP TYPE IF EXISTS "public"."node" CASCADE;
CREATE TYPE "public"."node" AS ENUM('FILE', 'FOLDER');--> statement-breakpoint
CREATE TABLE "dir" (
	"node_id" text PRIMARY KEY NOT NULL,
	"node_name" text NOT NULL,
	"node_type" "node" NOT NULL,
	"is_public" boolean,
	"content" text,
	"owner_id" text NOT NULL,
	"parent_id" text NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dir_node_id_unique" UNIQUE("node_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"user_id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	CONSTRAINT "user_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
