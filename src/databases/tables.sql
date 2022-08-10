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