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
	"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
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
	"post_id" INTEGER NOT NULL,
	"hashtag_id" INTEGER NOT NULL 
);

