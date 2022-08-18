CREATE TABLE "users" (
	"id" serial NOT NULL,
	"username" varchar(120) NOT NULL,
	"email" varchar(120) NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"imageUrl" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" INTEGER NOT NULL REFERENCES users(id),
	"url" TEXT NOT NULL,
	"text" TEXT,
	"urlTitle" TEXT,
	"urlImage" TEXT,
	"urlDescription" TEXT,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" INTEGER NOT NULL REFERENCES users(id),
	"postId" INTEGER NOT NULL REFERENCES posts(id),
	"liked" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "hashtags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "post_hashtag" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" INTEGER NOT NULL REFERENCES posts(id),
	"hashtag_id" INTEGER NOT NULL REFERENCES hashtags(id) 
);

CREATE TABLE follow (
    id serial PRIMARY KEY NOT NULL,
    "userId" integer NOT NULL REFERENCES users(id),
    "followingUserId" integer NOT NULL REFERENCES users(id),
    following boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "repost" (
	"id" serial NOT NULL,
	"repostFrom" text NOT NULL,
	"userId" int NOT NULL REFERENCES "users"("id"),
	"postId" int NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT "repost_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "comments" (
	"id" serial NOT NULL,
	"text" text NOT NULL,
	"userId" int NOT NULL REFERENCES "users"("id"),
	"postId" int NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT "comments_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);