-- Database export via SQLPro (https://www.sqlprostudio.com/allapps.html)
-- Exported by lifeiscontent at 28-10-2023 20:17.
-- WARNING: This file may contain descructive statements such as DROPs.
-- Please ensure that you are running the script at the proper location.


-- BEGIN TABLE public.article_tags
DROP TABLE IF EXISTS public.article_tags CASCADE;
BEGIN;

CREATE TABLE IF NOT EXISTS public.article_tags (
	id bigint DEFAULT nextval('article_tags_id_seq'::regclass) NOT NULL,
	created_at timestamp without time zone DEFAULT now() NOT NULL,
	updated_at timestamp without time zone DEFAULT now() NOT NULL,
	article_id bigint DEFAULT nextval('article_tags_article_id_seq'::regclass) NOT NULL,
	tag_id bigint DEFAULT nextval('article_tags_tag_id_seq'::regclass) NOT NULL,
	PRIMARY KEY(id)
);

COMMIT;

-- END TABLE public.article_tags

-- BEGIN TABLE public.articles
DROP TABLE IF EXISTS public.articles CASCADE;
BEGIN;

CREATE TABLE IF NOT EXISTS public.articles (
	id bigint DEFAULT nextval('articles_id_seq'::regclass) NOT NULL,
	created_at timestamp without time zone DEFAULT now() NOT NULL,
	updated_at timestamp without time zone DEFAULT now() NOT NULL,
	slug character varying NOT NULL,
	title character varying NOT NULL,
	description character varying NOT NULL,
	body text NOT NULL,
	favorites_count integer DEFAULT 0 NOT NULL,
	author_id bigint DEFAULT nextval('articles_author_id_seq'::regclass) NOT NULL,
	PRIMARY KEY(id)
);

COMMIT;

-- END TABLE public.articles

-- BEGIN TABLE public.comments
DROP TABLE IF EXISTS public."comments" CASCADE;
BEGIN;

CREATE TABLE IF NOT EXISTS public."comments" (
	id bigint DEFAULT nextval('comments_id_seq'::regclass) NOT NULL,
	created_at timestamp without time zone DEFAULT now() NOT NULL,
	updated_at timestamp without time zone DEFAULT now() NOT NULL,
	body text NOT NULL,
	article_id bigint DEFAULT nextval('comments_article_id_seq'::regclass) NOT NULL,
	author_id bigint DEFAULT nextval('comments_author_id_seq'::regclass) NOT NULL,
	PRIMARY KEY(id)
);

COMMIT;

-- END TABLE public.comments

-- BEGIN TABLE public.kysely_migration
DROP TABLE IF EXISTS public.kysely_migration CASCADE;
BEGIN;

CREATE TABLE IF NOT EXISTS public.kysely_migration (
	name character varying(255) NOT NULL,
	"timestamp" character varying(255) NOT NULL,
	PRIMARY KEY(name)
);

COMMIT;

-- END TABLE public.kysely_migration

-- BEGIN TABLE public.kysely_migration_lock
DROP TABLE IF EXISTS public.kysely_migration_lock CASCADE;
BEGIN;

CREATE TABLE IF NOT EXISTS public.kysely_migration_lock (
	id character varying(255) NOT NULL,
	is_locked integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(id)
);

COMMIT;

-- END TABLE public.kysely_migration_lock

-- BEGIN TABLE public.relationships
DROP TABLE IF EXISTS public.relationships CASCADE;
BEGIN;

CREATE TABLE IF NOT EXISTS public.relationships (
	created_at timestamp without time zone DEFAULT now() NOT NULL,
	updated_at timestamp without time zone DEFAULT now() NOT NULL,
	followed_id bigint DEFAULT nextval('relationships_followed_id_seq'::regclass) NOT NULL,
	follower_id bigint DEFAULT nextval('relationships_follower_id_seq'::regclass) NOT NULL
);

COMMIT;

-- END TABLE public.relationships

-- BEGIN TABLE public.tags
DROP TABLE IF EXISTS public.tags CASCADE;
BEGIN;

CREATE TABLE IF NOT EXISTS public.tags (
	id bigint DEFAULT nextval('tags_id_seq'::regclass) NOT NULL,
	created_at timestamp without time zone DEFAULT now() NOT NULL,
	updated_at timestamp without time zone DEFAULT now() NOT NULL,
	name character varying NOT NULL,
	PRIMARY KEY(id)
);

COMMIT;

-- END TABLE public.tags

-- BEGIN TABLE public.user_favorite_articles
DROP TABLE IF EXISTS public.user_favorite_articles CASCADE;
BEGIN;

CREATE TABLE IF NOT EXISTS public.user_favorite_articles (
	created_at timestamp without time zone DEFAULT now() NOT NULL,
	updated_at timestamp without time zone DEFAULT now() NOT NULL,
	article_id bigint DEFAULT nextval('user_favorite_articles_article_id_seq'::regclass) NOT NULL,
	user_id bigint DEFAULT nextval('user_favorite_articles_user_id_seq'::regclass) NOT NULL
);

COMMIT;

-- END TABLE public.user_favorite_articles

-- BEGIN TABLE public.users
DROP TABLE IF EXISTS public.users CASCADE;
BEGIN;

CREATE TABLE IF NOT EXISTS public.users (
	id bigint DEFAULT nextval('users_id_seq'::regclass) NOT NULL,
	created_at timestamp without time zone DEFAULT now() NOT NULL,
	updated_at timestamp without time zone DEFAULT now() NOT NULL,
	email character varying NOT NULL,
	username character varying NOT NULL,
	encrypted_password character varying NOT NULL,
	image text DEFAULT 'https://realworld-temp-api.herokuapp.com/images/smiley-cyrus.jpeg'::text,
	bio text,
	PRIMARY KEY(id)
);

COMMIT;

-- END TABLE public.users

ALTER TABLE IF EXISTS public.article_tags
	ADD CONSTRAINT article_tags_article_id_fkey
	FOREIGN KEY (article_id)
	REFERENCES public.articles (id)
	ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.article_tags
	ADD CONSTRAINT article_tags_tag_id_fkey
	FOREIGN KEY (tag_id)
	REFERENCES public.tags (id)
	ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.articles
	ADD CONSTRAINT articles_author_id_fkey
	FOREIGN KEY (author_id)
	REFERENCES public.users (id)
	ON DELETE CASCADE;

ALTER TABLE IF EXISTS public."comments"
	ADD CONSTRAINT comments_author_id_fkey
	FOREIGN KEY (author_id)
	REFERENCES public.users (id)
	ON DELETE CASCADE;

ALTER TABLE IF EXISTS public."comments"
	ADD CONSTRAINT comments_article_id_fkey
	FOREIGN KEY (article_id)
	REFERENCES public.articles (id)
	ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.relationships
	ADD CONSTRAINT relationships_followed_id_fkey
	FOREIGN KEY (followed_id)
	REFERENCES public.users (id)
	ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.relationships
	ADD CONSTRAINT relationships_follower_id_fkey
	FOREIGN KEY (follower_id)
	REFERENCES public.users (id)
	ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.user_favorite_articles
	ADD CONSTRAINT user_favorite_articles_user_id_fkey
	FOREIGN KEY (user_id)
	REFERENCES public.users (id)
	ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.user_favorite_articles
	ADD CONSTRAINT user_favorite_articles_article_id_fkey
	FOREIGN KEY (article_id)
	REFERENCES public.articles (id)
	ON DELETE CASCADE;

