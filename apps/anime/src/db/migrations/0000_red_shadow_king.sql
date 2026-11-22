CREATE TABLE IF NOT EXISTS "anime_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"mal_id" integer,
	"title" text NOT NULL,
	"title_en" text,
	"image_url" text,
	"status" text DEFAULT 'WATCHING' NOT NULL,
	"score" integer,
	"episodes_watched" integer DEFAULT 0 NOT NULL,
	"total_episodes" integer,
	"personal_notes" text,
	"genres" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "anime_entries_mal_id_unique" UNIQUE("mal_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mal_tokens" (
	"id" text PRIMARY KEY DEFAULT 'primary_token' NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"expires_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
