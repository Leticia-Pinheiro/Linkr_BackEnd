CREATE TABLE "public.users" (
	"id" serial NOT NULL,
	"username" varchar(120) NOT NULL,
	"email" varchar(120) NOT NULL UNIQUE,
	"password" TEXT(100) NOT NULL,
	"imageUrl" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT 'NOW()',
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

CREATE TABLE "hashtags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" TEXT NOT NULL UNIQUE
);