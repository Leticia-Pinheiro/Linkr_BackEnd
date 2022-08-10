CREATE TABLE "users" (
	"id" serial NOT NULL,
	"username" varchar(120) NOT NULL UNIQUE,
	"email" varchar(120) NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"imageUrl" TEXT NOT NULL,
	"createdAt" DATE NOT NULL DEFAULT 'NOW()',
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" INTEGER NOT NULL REFERENCES users(id),
	"url" TEXT NOT NULL,
	"text" TEXT,
	"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);