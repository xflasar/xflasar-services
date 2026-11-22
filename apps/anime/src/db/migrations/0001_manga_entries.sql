CREATE TABLE IF NOT EXISTS "manga_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"mal_id" integer UNIQUE,
	"title" text NOT NULL,
	"title_en" text,
	"image_url" text,
	"status" text DEFAULT 'READING' NOT NULL,
	"score" integer,
	"chapters_read" integer DEFAULT 0 NOT NULL,
	"total_chapters" integer,
	"volumes_read" integer DEFAULT 0 NOT NULL,
	"total_volumes" integer,
	"personal_notes" text,
	"genres" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
