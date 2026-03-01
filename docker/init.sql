--
-- PostgreSQL database dump
--


-- Dumped from database version 16.12
-- Dumped by pg_dump version 16.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ListingStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ListingStatus" AS ENUM (
    'ACTIVE',
    'PAUSED',
    'DELETED',
    'PENDING'
);


--
-- Name: ReportStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ReportStatus" AS ENUM (
    'PENDING',
    'REVIEWED',
    'DISMISSED'
);


--
-- Name: ReviewStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ReviewStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id text NOT NULL,
    slug text NOT NULL,
    "nameKey" text NOT NULL,
    "iconName" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: conversation_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_participants (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    "userId" text NOT NULL,
    "unreadCount" integer DEFAULT 0 NOT NULL,
    "lastReadAt" timestamp(3) without time zone,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id text NOT NULL,
    "listingId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listings (
    id text NOT NULL,
    "userId" text NOT NULL,
    "categoryId" text NOT NULL,
    title character varying(120) NOT NULL,
    description text NOT NULL,
    "priceType" text DEFAULT 'negotiable'::text NOT NULL,
    "priceAmount" double precision,
    district text,
    latitude double precision,
    longitude double precision,
    status public."ListingStatus" DEFAULT 'ACTIVE'::public."ListingStatus" NOT NULL,
    "imageUrls" text[] DEFAULT ARRAY[]::text[],
    tags text[] DEFAULT ARRAY[]::text[],
    "viewCount" integer DEFAULT 0 NOT NULL,
    "averageRating" double precision DEFAULT 0 NOT NULL,
    "reviewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: login_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.login_events (
    id text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    "senderId" text NOT NULL,
    content text NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deletedFor" text[] DEFAULT ARRAY[]::text[]
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id text NOT NULL,
    "userId" text NOT NULL,
    bio text,
    "avatarUrl" text,
    phone text,
    district text,
    latitude double precision,
    longitude double precision,
    address text,
    "isLocationPublic" boolean DEFAULT true NOT NULL,
    "averageRating" double precision DEFAULT 0 NOT NULL,
    "reviewCount" integer DEFAULT 0 NOT NULL,
    "skillTags" text[] DEFAULT ARRAY[]::text[],
    "preferredLocale" text DEFAULT 'de'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    banned boolean DEFAULT false NOT NULL
);


--
-- Name: reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reports (
    id text NOT NULL,
    "reporterId" text NOT NULL,
    "reportedId" text NOT NULL,
    reason text NOT NULL,
    details text,
    status public."ReportStatus" DEFAULT 'PENDING'::public."ReportStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "listingId" text
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id text NOT NULL,
    "listingId" text,
    "authorId" text NOT NULL,
    "targetId" text NOT NULL,
    rating integer NOT NULL,
    comment text,
    status public."ReviewStatus" DEFAULT 'APPROVED'::public."ReviewStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    "passwordHash" text,
    name text,
    image text,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_tokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
659f12a4-ae9e-428a-bd27-e249f8bd6b7f	2b2790b08d1cf551ccad92820959d9e8c6724f2948c18d7c6ecd77e32e2f40dc	2026-02-23 17:55:36.437641+00	20260223175536_init	\N	\N	2026-02-23 17:55:36.335649+00	1
594703cb-2671-456e-bd6b-2ce0bd45661b	d506d15e8db2d67b70335cdbbac537a6ca649204d086670594a55a96c68f93a8	2026-02-25 14:20:12.348374+00	20260225142012_optional_listing_review	\N	\N	2026-02-25 14:20:12.337671+00	1
6d9154a6-cfee-4639-a785-a2ea54f36242	aa2471620a6fb3f0f25f50557b5c5583b32658c1de4cd904bbcdacfe13cec580	2026-03-01 08:17:18.846543+00	20260227154934_add_banned_to_profile	\N	\N	2026-03-01 08:17:18.833692+00	1
1b25c6e4-f62b-40f3-9512-0d68830bfb44	e23a3c7b0c672bef5b759f4e37ed832ab9becea3b139fe235aafec2779f97178	2026-03-01 08:17:18.878585+00	20260227163926_add_reports	\N	\N	2026-03-01 08:17:18.854043+00	1
ded95d2b-ded8-442a-ac26-73b9b95ca80f	9f8e12c1338ffe1c4890cf6de7dc5504cd86dea99fadabf7134df8dba3e09585	2026-03-01 08:17:18.890903+00	20260227164906_add_message_deleted_for	\N	\N	2026-03-01 08:17:18.885597+00	1
3499b6cf-bb70-4407-b799-50bad0a451b3	e6053f5db622fbbd60ee5fafe3b94dccb52d075838572e339376a417fa44b89a	2026-03-01 08:17:18.913074+00	20260228064156_add_login_events	\N	\N	2026-03-01 08:17:18.898733+00	1
fc5a7402-cff0-4820-889b-4b3437ed55b6	8bcdbeae6af7a2c09fa3d5e11e25c48900b1ae3ae200f58842fc41b462e077f1	2026-03-01 08:17:18.929912+00	20260228090827_listing_pending_and_report_listing	\N	\N	2026-03-01 08:17:18.920891+00	1
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, slug, "nameKey", "iconName", "sortOrder", "createdAt") FROM stdin;
cmlzh9di80000s2k6z65qn0hd	home-repair	categories.homeRepair	Wrench	1	2026-02-23 17:55:46.208
cmlzh9dig0001s2k65rzvx31u	cleaning	categories.cleaning	Sparkles	2	2026-02-23 17:55:46.216
cmlzh9dik0002s2k69iup0usk	it-help	categories.itHelp	Monitor	3	2026-02-23 17:55:46.22
cmlzh9dio0003s2k6c70cmthm	tutoring	categories.tutoring	BookOpen	4	2026-02-23 17:55:46.224
cmlzh9dir0004s2k6juws5z3c	babysitting	categories.babysitting	Baby	5	2026-02-23 17:55:46.227
cmlzh9diu0005s2k6ujqacuqx	moving	categories.moving	Truck	6	2026-02-23 17:55:46.231
cmlzh9dix0006s2k6yipho9iy	gardening	categories.gardening	Leaf	7	2026-02-23 17:55:46.233
cmlzh9dj00007s2k69j29ehtb	cooking	categories.cooking	ChefHat	8	2026-02-23 17:55:46.236
cmlzh9dj20008s2k6kw44rdx0	beauty	categories.beauty	Scissors	9	2026-02-23 17:55:46.239
cmlzh9dj50009s2k6u9vced7v	other	categories.other	HelpCircle	10	2026-02-23 17:55:46.242
\.


--
-- Data for Name: conversation_participants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.conversation_participants (id, "conversationId", "userId", "unreadCount", "lastReadAt", "joinedAt") FROM stdin;
cmlzp2vb500081358fj0vc6mn	cmlzp2vb500061358y2ebjr8e	cmlzp2icc0004135848tsuh53	0	2026-02-23 21:56:28.626	2026-02-23 21:34:39.617
cmlzp2vb500091358g9irg6fp	cmlzp2vb500061358y2ebjr8e	cmlzimbrz00001358r8nmtvtg	0	2026-02-23 22:23:52.724	2026-02-23 21:34:39.617
cmlzrlgld0002byympwujjqha	cmlzrlgl00000byymkb1ey8wt	cmlzp2icc0004135848tsuh53	0	2026-02-23 22:45:08.038	2026-02-23 22:45:06.228
cmlzrlgld0003byymix6r8cta	cmlzrlgl00000byymkb1ey8wt	cmlzimbrz00001358r8nmtvtg	0	2026-02-25 14:19:40.084	2026-02-23 22:45:06.228
cmm2586xv0008bv9ag1plwk47	cmm2586xv0006bv9arcmy1odo	cmlzp2icc0004135848tsuh53	0	2026-02-25 14:42:16.271	2026-02-25 14:42:14.179
cmm2586xv0009bv9adb86vxga	cmm2586xv0006bv9arcmy1odo	cmm24yvif000mepd2lqt0u2pj	1	\N	2026-02-25 14:42:14.179
cmm2749n4000fbv9aehiw62t2	cmm2749n4000cbv9aod9or8x4	cmm24yvsd0096epd2gaa3evbh	0	\N	2026-02-25 15:35:10.288
cmm2749n4000ebv9au4txwu58	cmm2749n4000cbv9aod9or8x4	cmlzp2icc0004135848tsuh53	0	2026-02-25 15:35:10.684	2026-02-25 15:35:10.288
cmm33oegk000275arnlu0wwll	cmm33oegj000075aryvhb9161	cmm24yvju001uepd2rqzak6lb	0	2026-02-26 06:46:39.24	2026-02-26 06:46:37.363
cmm33oegk000375ar3xta8cku	cmm33oegj000075aryvhb9161	cmm24yvuo00b0epd23vthjfsx	1	\N	2026-02-26 06:46:37.363
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.conversations (id, "listingId", "createdAt", "updatedAt") FROM stdin;
cmlzp2vb500061358y2ebjr8e	cmlzol92h00031358r9lb9aur	2026-02-23 21:34:39.617	2026-02-23 21:56:36.24
cmlzrlgl00000byymkb1ey8wt	cmlzpx0s9000d135833cymqcv	2026-02-23 22:45:06.228	2026-02-23 22:45:21.458
cmm2586xv0006bv9arcmy1odo	cmm24yviv0011epd28t85ttbw	2026-02-25 14:42:14.179	2026-02-25 14:42:27.655
cmm2749n4000cbv9aod9or8x4	cmm24yvt4009pepd2v6tws4d1	2026-02-25 15:35:10.288	2026-02-25 15:35:10.288
cmm33oegj000075aryvhb9161	cmm24yvv400bdepd2pmpwfeun	2026-02-26 06:46:37.363	2026-02-26 06:46:53.325
\.


--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listings (id, "userId", "categoryId", title, description, "priceType", "priceAmount", district, latitude, longitude, status, "imageUrls", tags, "viewCount", "averageRating", "reviewCount", "createdAt", "updatedAt") FROM stdin;
cmlzq6vnw000h13584kct5u7t	cmlzimbrz00001358r8nmtvtg	cmlzh9dj50009s2k6u9vced7v	Schlüsseldienst – Türen öffnen	Ich öffne Haus- und Autotüren bei Aussperrung. Schnelle Hilfe vor Ort, ohne Beschädigung des Schlosses.	fixed	50	tempelhof-schoeneberg	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-23 22:05:46.316	2026-02-25 17:12:34.462
cmlzpx0s9000d135833cymqcv	cmlzimbrz00001358r8nmtvtg	cmlzh9dik0002s2k69iup0usk	IT-Support & Computer-Hilfe	Ich helfe bei Formatierung, Programminstallation, Virenentfernung und allgemeinen PC-Problemen. Schnelle und unkomplizierte Hilfe.	fixed	5	pankow	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-23 21:58:06.392	2026-02-25 17:12:34.451
cmlzq8uf5000j1358xfiy3fpz	cmlzimbrz00001358r8nmtvtg	cmlzh9dj50009s2k6u9vced7v	Web- & Android-App-Entwicklung	Ich entwickle Web-Apps und Android-Anwendungen. Von der Idee bis zur fertigen App – professionell und günstig.	fixed	500	steglitz-zehlendorf	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-23 22:07:18.016	2026-02-25 17:12:34.466
cmlzpygmn000f13580i3g81wn	cmlzimbrz00001358r8nmtvtg	cmlzh9dig0001s2k65rzvx31u	Haushaltsreinigung	Ich biete professionelle Wohnungsreinigung an. Gründliche Reinigung aller Räume, zuverlässig und pünktlich.	hourly	10	spandau	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-23 21:59:13.582	2026-02-25 17:12:34.469
cmm220jny0003quhphm23h0i9	cmm220jna0000quhp2nvxeuhz	cmlzh9dig0001s2k65rzvx31u	Wohnung grundlich reinigen	Professionelle Wohnungsreinigung - alle Raume, Kuche und Bad. Zuverlassig und punktlich.	HOURLY	18	mitte	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.574	2026-02-25 17:12:34.472
cmm220jo50005quhpdw7d2qht	cmm220jna0000quhp2nvxeuhz	cmlzh9dio0003s2k6c70cmthm	Mathe-Nachhilfe fur Schuler	Nachhilfe in Mathematik fur Klassen 5-10. Geduldig und verstandlich erklart.	HOURLY	20	pankow	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.581	2026-02-25 17:12:34.475
cmlzol92h00031358r9lb9aur	cmlzimbrz00001358r8nmtvtg	cmlzh9di80000s2k6z65qn0hd	Geschirrspüler-Reparatur	Ich repariere Geschirrspüler und andere Haushaltsgeräte. Schnelle und zuverlässige Hilfe direkt bei Ihnen zu Hause.	fixed	20	charlottenburg-wilmersdorf	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-23 21:20:57.639	2026-02-25 17:12:34.458
cmm220jo80007quhp6euqh6x1	cmm220jna0000quhp2nvxeuhz	cmlzh9di80000s2k6z65qn0hd	Fahrradwartung & Reparatur	Ich repariere und warte Fahrrader aller Art. Reifenwechsel, Bremsen, Schaltung.	FIXED	35	friedrichshain-kreuzberg	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.584	2026-02-25 17:12:34.477
cmm220joa0009quhp744emv48	cmm220jna0000quhp2nvxeuhz	cmlzh9dir0004s2k6juws5z3c	Babysitting abends & Wochenende	Zuverlassige Kinderbetreuung fur Kinder ab 2 Jahren. Erfahrung mit Kleinkindern.	HOURLY	15	charlottenburg-wilmersdorf	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.587	2026-02-25 17:12:34.481
cmm220jod000bquhpp4oj53f9	cmm220jna0000quhp2nvxeuhz	cmlzh9diu0005s2k6ujqacuqx	Mobel aufbauen & umziehen	Helfe beim Umzug, Mobelaufbau und Transport. Eigenes Werkzeug vorhanden.	HOURLY	25	spandau	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.589	2026-02-25 17:12:34.483
cmm220jog000dquhphzhk07wm	cmm220jna0000quhp2nvxeuhz	cmlzh9dix0006s2k6yipho9iy	Gartenarbeit & Rasenmahen	Rasen mahen, Hecken schneiden, Beete pflegen. Fur Garten aller Grossen.	HOURLY	20	steglitz-zehlendorf	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.592	2026-02-25 17:12:34.485
cmm220joj000fquhpxwwdreet	cmm220jna0000quhp2nvxeuhz	cmlzh9dio0003s2k6c70cmthm	Deutsch-Nachhilfe fur Auslander	Deutschkurs fur Anfanger und Fortgeschrittene. Geduldig, mit Alltagsubungen.	HOURLY	22	neukoelln	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.595	2026-02-25 17:12:34.488
cmm220jom000hquhpllgn27vy	cmm220jna0000quhp2nvxeuhz	cmlzh9dik0002s2k69iup0usk	PC & Laptop reparieren	Windows-Probleme, Viren entfernen, Software installieren. Schnell und gunstig.	FIXED	40	mitte	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.599	2026-02-25 17:12:34.491
cmm220jos000lquhpt8btjli9	cmm220jna0000quhp2nvxeuhz	cmlzh9dj20008s2k6kw44rdx0	Haare schneiden zuhause	Professioneller Haarschnitt bei Ihnen zuhause. Damen und Herren.	FIXED	25	lichtenberg	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.604	2026-02-25 17:12:34.496
cmm220jou000nquhp722hbda7	cmm220jna0000quhp2nvxeuhz	cmlzh9di80000s2k6z65qn0hd	Wasserhahn & Rohr reparieren	Kleine Sanitararbeiten: tropfende Hahne, verstopfte Abflusse, Dichtungen wechseln.	FIXED	45	reinickendorf	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.607	2026-02-25 17:12:34.498
cmm220jox000pquhpgjr9yfl7	cmm220jna0000quhp2nvxeuhz	cmlzh9dio0003s2k6c70cmthm	Englisch-Nachhilfe alle Niveaus	Englischunterricht fur Schuler und Erwachsene. Business English auf Wunsch.	HOURLY	25	charlottenburg-wilmersdorf	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.609	2026-02-25 17:12:34.5
cmlzqa0hh000l1358zcra351e	cmlzimbrz00001358r8nmtvtg	cmlzh9dj50009s2k6u9vced7v	Reifenwechsel & Reifenreparatur	Ich wechsle und repariere Reifen Ihrer Fahrzeuge. Sommer- und Winterreifen, schnell und fachgerecht.	hourly	20	spandau	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-23 22:08:12.532	2026-02-25 17:12:34.505
cmm220jp8000vquhpa7b45307	cmm220jna0000quhp2nvxeuhz	cmlzh9dix0006s2k6yipho9iy	Blumen & Pflanzen pflegen	Pflanzenpflege wahrend Ihres Urlaubs. Giessen, dunger, umtopfen.	FIXED	15	friedrichshain-kreuzberg	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.621	2026-02-25 17:12:34.51
cmm220jpd000zquhpo80kyan8	cmm220jna0000quhp2nvxeuhz	cmlzh9dj20008s2k6kw44rdx0	Manikure & Nagelpflege zuhause	Nagelpflege, Gelnagel, Manikure - komfortabel bei Ihnen daheim.	FIXED	35	neukoelln	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.625	2026-02-25 17:12:34.515
cmm220jpf0011quhpowzkc38n	cmm220jna0000quhp2nvxeuhz	cmlzh9dir0004s2k6juws5z3c	Kinderbetreuung nachmittags	Nachmittagsbetreuung fur Schulkinder. Hausaufgabenhilfe inklusive.	HOURLY	12	marzahn-hellersdorf	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.628	2026-02-25 17:12:34.517
cmm220jph0013quhpeq589vr7	cmm220jna0000quhp2nvxeuhz	cmlzh9dj00007s2k69j29ehtb	Abendessen fur Familien kochen	Ich koche frische, gesunde Mahlzeiten fur Ihre Familie - auf Wunsch taglich.	FIXED	50	spandau	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.63	2026-02-25 17:12:34.52
cmm220jpm0017quhpkwkw6q7z	cmm220jna0000quhp2nvxeuhz	cmlzh9dio0003s2k6c70cmthm	Physik-Nachhilfe Oberstufe	Nachhilfe in Physik fur die Oberstufe und Abitur-Vorbereitung.	HOURLY	28	lichtenberg	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.634	2026-02-25 17:12:34.525
cmm220jpp0019quhpo92474ap	cmm220jna0000quhp2nvxeuhz	cmlzh9di80000s2k6z65qn0hd	Tapezieren & Streichen	Ich tapeziere und streiche Wande professionell. Saubere Arbeit, faire Preise.	HOURLY	22	charlottenburg-wilmersdorf	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.637	2026-02-25 17:12:34.527
cmm220jps001bquhpbphwaem8	cmm220jna0000quhp2nvxeuhz	cmlzh9dj20008s2k6kw44rdx0	Massage zuhause (Entspannung)	Entspannungsmassage bei Ihnen zuhause. Rucken, Schultern, Nacken.	FIXED	55	mitte	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.64	2026-02-25 17:12:34.529
cmm220jpw001fquhpcrzctd46	cmm220jna0000quhp2nvxeuhz	cmlzh9diu0005s2k6ujqacuqx	IKEA-Mobel aufbauen	Schneller und sorgfaltiger Aufbau von IKEA und anderen Mobeln.	FIXED	40	neukoelln	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.645	2026-02-25 17:12:34.533
cmm220jpy001hquhp4puisdtk	cmm220jna0000quhp2nvxeuhz	cmlzh9dj50009s2k6u9vced7v	Einkaufsservice fur Senioren	Ich kaufe fur altere Menschen ein und liefere direkt nach Hause. Kostenlos!	FREE	\N	reinickendorf	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.646	2026-02-25 17:12:34.535
cmm24yvhw0005epd2shcmyn17	cmm24yvh50000epd25psjcjkt	cmlzh9dig0001s2k65rzvx31u	Wohnungsreinigung – gründlich & zuverlässig	Komplette Wohnungsreinigung inkl. Küche, Bad und Böden. Eigene Reinigungsmittel. Regelmäßig oder einmalig.	hourly	18	mitte	52.52828894826816	13.39638435162572	ACTIVE	{https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&h=400&fit=crop&q=80}	{Reinigung,Haushalt,Putzen}	0	0	0	2026-02-25 14:34:59.444	2026-02-25 17:12:34.54
cmm24yvhy0007epd24ueeh2c6	cmm24yvh50000epd25psjcjkt	cmlzh9dik0002s2k69iup0usk	PC & Laptop reparieren	Langsamer Rechner, Viren, Abstürze – ich diagnose und repariere. Windows, Mac und Linux.	hourly	30	mitte	52.52406569555093	13.40863898526085	ACTIVE	{https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80}	{Computer,Reparatur,Windows}	0	0	0	2026-02-25 14:34:59.446	2026-02-25 17:12:34.543
cmm24yvi00009epd2xjjt9xhr	cmm24yvh50000epd25psjcjkt	cmlzh9dio0003s2k6c70cmthm	Mathe-Nachhilfe (Klasse 5–13)	Erfahrene Lehrerin gibt Nachhilfe in Mathematik. Vom Bruchrechnen bis zur Analysis. Online oder in Pankow.	hourly	20	mitte	52.52049518492804	13.41482071836909	ACTIVE	{https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&q=80}	{Mathe,Nachhilfe,Schule}	0	0	0	2026-02-25 14:34:59.448	2026-02-25 17:12:34.545
cmm24yvi2000bepd2zdxhzyg2	cmm24yvh50000epd25psjcjkt	cmlzh9dir0004s2k6juws5z3c	Babysitting abends & am Wochenende	Zuverlässige Babysitterin mit Erfahrung. Ich komme zu euch nach Hause. Auch kurzfristig möglich.	hourly	12	mitte	52.5105857145471	13.41286057977319	ACTIVE	{https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=400&fit=crop&q=80}	{Babysitting,Kinder,Abend}	0	0	0	2026-02-25 14:34:59.45	2026-02-25 17:12:34.546
cmm24yvi6000fepd21z930y7u	cmm24yvh50000epd25psjcjkt	cmlzh9dix0006s2k6yipho9iy	Rasen mähen & Unkraut jäten	Regelmäßige Rasenpflege: Mähen, Kanten schneiden, Unkraut entfernen. Mit eigenem Mäher.	hourly	18	mitte	52.51763104450585	13.40289577161352	ACTIVE	{https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600&h=400&fit=crop&q=80}	{Rasen,Garten,Pflege}	0	0	0	2026-02-25 14:34:59.454	2026-02-25 17:12:34.551
cmm24yvi8000hepd2w41uzbi1	cmm24yvh50000epd25psjcjkt	cmlzh9dj00007s2k69j29ehtb	Kochen für Partys & Feiern	Ich koche für euer Event bis zu 30 Personen. Deutsche, mediterrane oder internationale Küche.	negotiable	\N	mitte	52.51162711397214	13.403623016175	ACTIVE	{https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80}	{Party,Kochen,Catering}	0	0	0	2026-02-25 14:34:59.456	2026-02-25 17:12:34.553
cmm24yvia000jepd25abl18gs	cmm24yvh50000epd25psjcjkt	cmlzh9dj20008s2k6kw44rdx0	Haarschnitt & Styling zu Hause	Mobile Friseurin kommt zu dir. Haarschnitt, Färben, Strähnen. Für Damen und Herren.	fixed	35	mitte	52.52395827479799	13.39846363291728	ACTIVE	{https://images.unsplash.com/photo-1595475884562-073c30d45670?w=600&h=400&fit=crop&q=80}	{Friseur,Haarschnitt,Mobil}	0	0	0	2026-02-25 14:34:59.458	2026-02-25 17:12:34.554
cmm24yvim000repd2ynl89z2f	cmm24yvif000mepd2lqt0u2pj	cmlzh9dig0001s2k65rzvx31u	Fenster putzen innen & außen	Saubere Fenster für mehr Licht. Ich putze Fenster in Wohnungen und Büros. Auch Hochparterre.	fixed	35	friedrichshain-kreuzberg	52.51206244007706	13.45730709522971	ACTIVE	{https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80}	{Fenster,Reinigung,Glanz}	0	0	0	2026-02-25 14:34:59.47	2026-02-25 17:12:34.562
cmm24yvio000tepd2b4muzc2z	cmm24yvif000mepd2lqt0u2pj	cmlzh9dik0002s2k69iup0usk	WLAN einrichten & optimieren	Kein Internet oder schlechtes Signal? Ich richte deinen Router ein und optimiere die WLAN-Abdeckung.	fixed	40	friedrichshain-kreuzberg	52.49760046711805	13.45815818080483	ACTIVE	{https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop&q=80}	{WLAN,Router,Internet}	0	0	0	2026-02-25 14:34:59.472	2026-02-25 17:12:34.565
cmm24yviq000vepd2qrlhllow	cmm24yvif000mepd2lqt0u2pj	cmlzh9dio0003s2k6c70cmthm	Englisch für Alltag & Beruf	Englischunterricht für Erwachsene. Konversation, Grammatik, Business-Englisch. Flexibel und individuell.	hourly	25	friedrichshain-kreuzberg	52.50749028931391	13.45544707227047	ACTIVE	{https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&q=80}	{Englisch,Sprachkurs,Erwachsene}	0	0	0	2026-02-25 14:34:59.474	2026-02-25 17:12:34.567
cmm24yvir000xepd2t8jypvpl	cmm24yvif000mepd2lqt0u2pj	cmlzh9dir0004s2k6juws5z3c	Kinderbetreuung ganztags	Ganztagesbetreuung für Kinder von 1–10 Jahren. Spielen, Essen, Schlafen – liebevoll und strukturiert.	hourly	10	friedrichshain-kreuzberg	52.5037311237094	13.44817363236265	ACTIVE	{https://images.unsplash.com/photo-1533483595632-c5f0e57a1936?w=600&h=400&fit=crop&q=80}	{Kinderbetreuung,Ganztag,Spielen}	0	0	0	2026-02-25 14:34:59.476	2026-02-25 17:12:34.569
cmm24yviw0013epd29e5wyr02	cmm24yvif000mepd2lqt0u2pj	cmlzh9dj00007s2k69j29ehtb	Kochkurs für Anfänger	Lerne kochen von Grund auf. Ich bringe dir Grundtechniken und leckere Alltagsrezepte bei.	fixed	40	friedrichshain-kreuzberg	52.50967569661133	13.4563462640155	ACTIVE	{https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&q=80}	{Kochkurs,Anfänger,Lernen}	0	0	0	2026-02-25 14:34:59.481	2026-02-25 17:12:34.573
cmm24yviy0015epd2rs9lurgp	cmm24yvif000mepd2lqt0u2pj	cmlzh9dj20008s2k6kw44rdx0	Maniküre & Gelnägel	Professionelle Maniküre, Gelnägel, Nageldesign. Ich komme zu dir oder du kommst zu mir.	fixed	40	friedrichshain-kreuzberg	52.50597534807741	13.44483100866642	ACTIVE	{https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop&q=80}	{Nägel,Maniküre,Gel}	0	0	0	2026-02-25 14:34:59.483	2026-02-25 17:12:34.575
cmm24yvj00017epd2n19mjms7	cmm24yvif000mepd2lqt0u2pj	cmlzh9dj50009s2k6u9vced7v	Hund ausführen & Tiersitting	Ich führe deinen Hund aus und passe auf Haustiere auf, wenn du weg bist. Mit viel Liebe.	hourly	10	friedrichshain-kreuzberg	52.50100300458892	13.46102736556405	ACTIVE	{https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop&q=80}	{Hund,Tiersitting,Gassi}	0	0	0	2026-02-25 14:34:59.484	2026-02-25 17:12:34.577
cmm24yvj8001bepd2chl9x1gh	cmm24yvj30018epd2rxi8qgi4	cmlzh9di80000s2k6z65qn0hd	IKEA-Möbel aufbauen	Ich baue alle IKEA-Möbel schnell und korrekt auf. Kein Stress mit Anleitungen – ich mache das für dich.	fixed	40	pankow	52.56101558935601	13.3985014446927	ACTIVE	{https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop&q=80}	{IKEA,Möbelaufbau,Heimwerken}	0	0	0	2026-02-25 14:34:59.492	2026-02-25 17:12:34.58
cmm24yvjc001fepd20ahgjsae	cmm24yvj30018epd2rxi8qgi4	cmlzh9dik0002s2k69iup0usk	Smartphone-Bildschirm austauschen	Gebrochenes Display? Ich tausche Bildschirme bei den meisten Smartphone-Modellen aus. Schnell und günstig.	fixed	50	pankow	52.55692214530397	13.41098000399839	ACTIVE	{https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&q=80}	{Handy,Display,Reparatur}	0	0	0	2026-02-25 14:34:59.497	2026-02-25 17:12:34.585
cmm24yvjf001hepd2x4g1m7t4	cmm24yvj30018epd2rxi8qgi4	cmlzh9dio0003s2k6c70cmthm	Deutsch als Fremdsprache (DAF)	Deutschkurs für Ausländer. Anfänger bis Fortgeschrittene. Geduldig und methodisch.	hourly	22	pankow	52.57247642729068	13.39948699628468	ACTIVE	{https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&q=80}	{Deutsch,DAF,Integration}	0	0	0	2026-02-25 14:34:59.499	2026-02-25 17:12:34.587
cmm24yvjg001jepd2zxzb19xw	cmm24yvj30018epd2rxi8qgi4	cmlzh9dir0004s2k6juws5z3c	Ferienbetreuung für Schulkinder	Ich betreue eure Kinder in den Ferien. Ausflüge, Basteln, Spielen – kreatives Ferienprogramm.	hourly	11	pankow	52.56974755274751	13.40310239711227	ACTIVE	{https://images.unsplash.com/photo-1543342384-1f1350e27861?w=600&h=400&fit=crop&q=80}	{Ferien,Schulkind,Betreuung}	0	0	0	2026-02-25 14:34:59.501	2026-02-25 17:12:34.589
cmm24yvjj001lepd27se9jf83	cmm24yvj30018epd2rxi8qgi4	cmlzh9diu0005s2k6ujqacuqx	Umzugskartons packen & transportieren	Professionelles Einpacken und Transportieren. Bücher, Geschirr, Elektronik – alles sicher verpackt.	hourly	20	pankow	52.5651960756035	13.39362588426741	ACTIVE	{https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&h=400&fit=crop&q=80}	{Kartons,Packen,Transport}	0	0	0	2026-02-25 14:34:59.503	2026-02-25 17:12:34.591
cmm24yvjn001pepd2y00pyuja	cmm24yvj30018epd2rxi8qgi4	cmlzh9dj00007s2k69j29ehtb	Meal Prep – gesund für die Woche vorkochen	Ich koche gesunde Mahlzeiten für deine ganze Woche vor. Portioniert und fertig zum Aufwärmen.	fixed	80	pankow	52.56619674041099	13.40383600579837	ACTIVE	{https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop&q=80}	{"Meal Prep",Gesund,Vorkochen}	0	0	0	2026-02-25 14:34:59.507	2026-02-25 17:12:34.595
cmm24yvjp001repd264h9ls07	cmm24yvj30018epd2rxi8qgi4	cmlzh9dj20008s2k6kw44rdx0	Wimpernverlängerung & -lifting	Voluminöse Wimpern durch Lifting oder Verlängerung. Lang anhaltend und natürlich wirkend.	fixed	55	pankow	52.56623950554373	13.39348353428985	ACTIVE	{https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop&q=80}	{Wimpern,Lifting,Beauty}	0	0	0	2026-02-25 14:34:59.509	2026-02-25 17:12:34.597
cmm24yvjr001tepd2wkh9u5et	cmm24yvj30018epd2rxi8qgi4	cmlzh9dj50009s2k6u9vced7v	Übersetzungen DE / EN / TR	Übersetzungen von Dokumenten, Briefen und Formularen. Deutsch, Englisch und Türkisch.	fixed	30	pankow	52.57689966213008	13.40041172925546	ACTIVE	{https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&q=80}	{Übersetzen,Dokumente,Mehrsprachig}	0	0	0	2026-02-25 14:34:59.511	2026-02-25 17:12:34.599
cmm24yvk1001zepd2gn78wfr3	cmm24yvju001uepd2rqzak6lb	cmlzh9dig0001s2k65rzvx31u	Teppich- und Polsterreinigung	Tiefenreinigung von Teppichen, Sofas und Autositzen. Mit Profi-Gerät. Flecken und Gerüche werden entfernt.	hourly	20	charlottenburg-wilmersdorf	52.51073096108889	13.31075386047986	ACTIVE	{https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop&q=80}	{Teppich,Polster,Tiefenreinigung}	0	0	0	2026-02-25 14:34:59.521	2026-02-25 17:12:34.604
cmm24yvk30021epd2egofdrq8	cmm24yvju001uepd2rqzak6lb	cmlzh9dik0002s2k69iup0usk	Drucker einrichten & Probleme lösen	Drucker will nicht drucken? Ich richte ihn ein, installiere Treiber und löse Verbindungsprobleme.	fixed	25	charlottenburg-wilmersdorf	52.50091471908781	13.30101283151524	ACTIVE	{https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop&q=80}	{Drucker,Setup,Netzwerk}	0	0	0	2026-02-25 14:34:59.523	2026-02-25 17:12:34.606
cmm24yvk60023epd229echiy4	cmm24yvju001uepd2rqzak6lb	cmlzh9dio0003s2k6c70cmthm	Abiturvorbereitung – alle Fächer	Intensivkurse zur Abiturvorbereitung in Mathe, Physik, Chemie und Deutsch. Kleine Gruppen möglich.	hourly	28	charlottenburg-wilmersdorf	52.50111943485875	13.31341107177307	ACTIVE	{https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&q=80}	{Abitur,Nachhilfe,Prüfung}	0	0	0	2026-02-25 14:34:59.526	2026-02-25 17:12:34.608
cmm24yvkb0027epd2umb9oaqv	cmm24yvju001uepd2rqzak6lb	cmlzh9diu0005s2k6ujqacuqx	Sperrmüll entsorgen & Transport	Ich entsorge Sperrmüll, alte Möbel und Elektrogeräte. Auch große Mengen kein Problem.	fixed	80	charlottenburg-wilmersdorf	52.50553834361131	13.29951436397215	ACTIVE	{https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop&q=80}	{Sperrmüll,Entsorgung,Transport}	0	0	0	2026-02-25 14:34:59.531	2026-02-25 17:12:34.612
cmm24yvkd0029epd2fvnuekvu	cmm24yvju001uepd2rqzak6lb	cmlzh9dix0006s2k6yipho9iy	Baum fällen & Äste entfernen	Kleinere Bäume und störende Äste werden fachgerecht entfernt. Sicherheit steht an erster Stelle.	negotiable	\N	charlottenburg-wilmersdorf	52.50223829537094	13.31232576970481	ACTIVE	{https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&h=400&fit=crop&q=80}	{Baum,Fällen,Äste}	0	0	0	2026-02-25 14:34:59.533	2026-02-25 17:12:34.614
cmm24yvkf002bepd2b630nst1	cmm24yvju001uepd2rqzak6lb	cmlzh9dj00007s2k69j29ehtb	Geburtstagstorten & Motivtorten backen	Individuelle Torten nach Wunsch: Motivtorten, Naked Cakes, Cupcakes. Mit Bestellung im Voraus.	fixed	60	charlottenburg-wilmersdorf	52.50325415296172	13.2989899781371	ACTIVE	{https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80}	{Torte,Geburtstag,Backen}	0	0	0	2026-02-25 14:34:59.535	2026-02-25 17:12:34.616
cmm24yvkh002depd223pg1k3v	cmm24yvju001uepd2rqzak6lb	cmlzh9dj20008s2k6kw44rdx0	Make-up für Hochzeiten & Events	Professionelles Make-up für deinen besonderen Tag. Brautmake-up, Abendmake-up, langhaltend.	fixed	70	charlottenburg-wilmersdorf	52.49979582542264	13.31126830666388	ACTIVE	{https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=400&fit=crop&q=80}	{Make-up,Hochzeit,Event}	0	0	0	2026-02-25 14:34:59.538	2026-02-25 17:12:34.618
cmm24yvkr002jepd27euo5z2f	cmm24yvkm002gepd2d3a8fzdx	cmlzh9di80000s2k6z65qn0hd	Badezimmer-Fliesen verlegen	Fachgerechtes Verlegen von Fliesen im Bad und in der Küche. Saubere Fugen garantiert.	negotiable	\N	spandau	52.53967159311856	13.19268465824194	ACTIVE	{https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop&q=80}	{Fliesen,Bad,Renovierung}	0	0	0	2026-02-25 14:34:59.547	2026-02-25 17:12:34.622
cmm24yvks002lepd2nagh6k5m	cmm24yvkm002gepd2d3a8fzdx	cmlzh9dig0001s2k65rzvx31u	Büroreinigung – täglich oder wöchentlich	Zuverlässige Büroreinigung auf Vertragsbasis. Frühmorgens oder abends, damit der Betrieb nicht gestört wird.	negotiable	\N	spandau	52.53211919055369	13.19408938008876	ACTIVE	{https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop&q=80}	{Büro,Reinigung,Gewerbe}	0	0	0	2026-02-25 14:34:59.549	2026-02-25 17:12:34.624
cmm24yvku002nepd2el5fjzwz	cmm24yvkm002gepd2d3a8fzdx	cmlzh9dik0002s2k69iup0usk	Daten retten & Backup einrichten	Daten verloren? Ich versuche sie zu retten. Ich richte auch automatische Backups ein – damit es nicht wieder passiert.	hourly	35	spandau	52.54492177963565	13.20429692159982	ACTIVE	{https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop&q=80}	{Datenrettung,Backup,Sicherheit}	0	0	0	2026-02-25 14:34:59.55	2026-02-25 17:12:34.626
cmm24yvkw002pepd2jqvbjtl1	cmm24yvkm002gepd2d3a8fzdx	cmlzh9dio0003s2k6c70cmthm	Gitarrenunterricht für Anfänger	Ich bringe dir Gitarre bei – von den ersten Akkorden bis zu deinen Lieblingssongs. Alle Altersstufen.	hourly	20	spandau	52.53327939122416	13.20277494000167	ACTIVE	{https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&q=80}	{Gitarre,Musik,Unterricht}	0	0	0	2026-02-25 14:34:59.552	2026-02-25 17:12:34.628
cmm24yvl0002tepd2k6ecgx1g	cmm24yvkm002gepd2d3a8fzdx	cmlzh9diu0005s2k6ujqacuqx	Piano & Klavier transportieren	Spezialtransport für Klaviere und Flügel. Mit Fachkenntnissen und dem richtigen Equipment.	negotiable	\N	spandau	52.53712674241092	13.194418218538	ACTIVE	{https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop&q=80}	{Klavier,Spezialtransport,Umzug}	0	0	0	2026-02-25 14:34:59.557	2026-02-25 17:12:34.632
cmm24yvl2002vepd2uzityn47	cmm24yvkm002gepd2d3a8fzdx	cmlzh9dix0006s2k6yipho9iy	Gartengestaltung & Beratung	Ich plane deinen Traumgarten und setze ihn mit dir um. Naturnahe und pflegeleichte Gärten.	hourly	30	spandau	52.54082740091005	13.20539862257923	ACTIVE	{https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&q=80}	{Gestaltung,Planung,Garten}	0	0	0	2026-02-25 14:34:59.558	2026-02-25 17:12:34.634
cmm24yvl4002xepd2qf9j5qx6	cmm24yvkm002gepd2d3a8fzdx	cmlzh9dj00007s2k69j29ehtb	Vegane & vegetarische Küche	Leckeres veganes und vegetarisches Essen zum Bestellen oder als Kochkurs. Nachhaltig und gesund.	hourly	25	spandau	52.53944814136339	13.20386127902939	ACTIVE	{https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=400&fit=crop&q=80}	{Vegan,Vegetarisch,Kochen}	0	0	0	2026-02-25 14:34:59.56	2026-02-25 17:12:34.636
cmm24yvl6002zepd2wkvp5x5w	cmm24yvkm002gepd2d3a8fzdx	cmlzh9dj20008s2k6kw44rdx0	Augenbrauen formen & färben	Augenbrauen zupfen, waxen, fadentechnisch formen und bei Bedarf färben. Schnell und präzise.	fixed	20	spandau	52.54047447396595	13.19493561624282	ACTIVE	{https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop&q=80}	{Augenbrauen,Formen,Beauty}	0	0	0	2026-02-25 14:34:59.562	2026-02-25 17:12:34.637
cmm24yvlh0037epd2p5lsowjt	cmm24yvla0032epd2ov7motu5	cmlzh9dig0001s2k65rzvx31u	Backofen & Kühlschrank reinigen	Hartnaäckiger Schmutz im Backofen oder Kühlschrank? Ich reinige gründlich mit umweltfreundlichen Mitteln.	fixed	30	steglitz-zehlendorf	52.42237574573125	13.24298554178054	ACTIVE	{https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&h=400&fit=crop&q=80}	{Küche,Backofen,Reinigung}	0	0	0	2026-02-25 14:34:59.573	2026-02-25 17:12:34.643
cmm24yvli0039epd22rfhtkl0	cmm24yvla0032epd2ov7motu5	cmlzh9dik0002s2k69iup0usk	Virus & Malware entfernen	Viren, Trojaner, Adware – ich reinige deinen PC gründlich und schütze ihn für die Zukunft.	fixed	45	steglitz-zehlendorf	52.42781728531212	13.24264760288647	ACTIVE	{https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80}	{Virus,Malware,Sicherheit}	0	0	0	2026-02-25 14:34:59.575	2026-02-25 17:12:34.646
cmm24yvlk003bepd2oafig8bv	cmm24yvla0032epd2ov7motu5	cmlzh9dio0003s2k6c70cmthm	Französisch für Schule & Reise	Nachhilfe und Konversationskurs in Französisch. Schüler und Erwachsene. Bei mir oder bei dir.	hourly	22	steglitz-zehlendorf	52.42907060119981	13.25513758808128	ACTIVE	{https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&q=80}	{Französisch,Sprache,Nachhilfe}	0	0	0	2026-02-25 14:34:59.577	2026-02-25 17:12:34.648
cmm24yvlo003fepd2fox6jhga	cmm24yvla0032epd2ov7motu5	cmlzh9diu0005s2k6ujqacuqx	Studentenumzug günstig	Günstiger Umzugsservice für Studenten. Schnell, zuverlässig und ohne unnötige Extras.	fixed	150	steglitz-zehlendorf	52.43723861898147	13.24161746979205	ACTIVE	{https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&q=80}	{Student,Umzug,Günstig}	0	0	0	2026-02-25 14:34:59.58	2026-02-25 17:12:34.652
cmm24yvlq003hepd2qeovoi00	cmm24yvla0032epd2ov7motu5	cmlzh9dix0006s2k6yipho9iy	Herbstlaub & Gartenabfälle entsorgen	Laub, Äste, Grasschnitt – ich entsorge alle Gartenabfälle sauber und schnell.	hourly	15	steglitz-zehlendorf	52.43898025439429	13.24655638564085	ACTIVE	{https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=400&fit=crop&q=80}	{Laub,Herbst,Entsorgung}	0	0	0	2026-02-25 14:34:59.583	2026-02-25 17:12:34.654
cmm24yvls003jepd29c8etguf	cmm24yvla0032epd2ov7motu5	cmlzh9dj00007s2k69j29ehtb	Türkische & orientalische Küche	Ich koche authentisches türkisches und orientalisches Essen für euch. Kebab, Meze, Baklava & mehr.	fixed	50	steglitz-zehlendorf	52.43796082743343	13.24284314529166	ACTIVE	{https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80}	{Türkisch,Orientalisch,Catering}	0	0	0	2026-02-25 14:34:59.585	2026-02-25 17:12:34.655
cmm24yvlu003lepd2op5ktocz	cmm24yvla0032epd2ov7motu5	cmlzh9dj20008s2k6kw44rdx0	Pediküre & Fußpflege	Verwöhne deine Füße mit professioneller Pediküre. Hornhaut, Nagelpflege, Lackieren.	fixed	35	steglitz-zehlendorf	52.42506785124122	13.25757062533835	ACTIVE	{https://images.unsplash.com/photo-1595475884562-073c30d45670?w=600&h=400&fit=crop&q=80}	{Pediküre,Füße,Pflege}	0	0	0	2026-02-25 14:34:59.587	2026-02-25 17:12:34.657
cmm24yvm3003repd2y0qiqr4r	cmm24yvlz003oepd2i52hdihx	cmlzh9di80000s2k6z65qn0hd	Gartenhaus aufbauen	Aufbau von Gartenhäusern, Pergolen und Carports. Auch Montage von Sichtschutzzäunen.	negotiable	\N	tempelhof-schoeneberg	52.45759018128643	13.37169199960771	ACTIVE	{https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&q=80}	{Gartenhaus,Holzbau,Montage}	0	0	0	2026-02-25 14:34:59.596	2026-02-25 17:12:34.662
cmm24yvm5003tepd2olchm179	cmm24yvlz003oepd2i52hdihx	cmlzh9dig0001s2k65rzvx31u	Keller & Dachboden entrümpeln	Ich helfe beim Sortieren und Entrümpeln von Keller, Dachboden oder Garage. Entsorgung auf Wunsch möglich.	hourly	15	tempelhof-schoeneberg	52.4681670364202	13.38732924396952	ACTIVE	{https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80}	{Entrümpeln,Keller,Aufräumen}	0	0	0	2026-02-25 14:34:59.598	2026-02-25 17:12:34.664
cmm24yvm7003vepd2vjtykqpk	cmm24yvlz003oepd2i52hdihx	cmlzh9dik0002s2k69iup0usk	Website erstellen (WordPress)	Einfache und professionelle WordPress-Websites für kleine Unternehmen und Selbstständige.	negotiable	\N	tempelhof-schoeneberg	52.47010281996621	13.37844955338736	ACTIVE	{https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop&q=80}	{Website,WordPress,Online}	0	0	0	2026-02-25 14:34:59.6	2026-02-25 17:12:34.667
cmm24yvm9003xepd2u3y61621	cmm24yvlz003oepd2i52hdihx	cmlzh9dio0003s2k6c70cmthm	Programmieren lernen (Python & Webdev)	Ich bringe dir Python und Webentwicklung bei. Für Anfänger und Quereinsteiger. Praxisorientiert.	hourly	30	tempelhof-schoeneberg	52.45810490799092	13.37463592741124	ACTIVE	{https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&q=80}	{Programmieren,Python,Coding}	0	0	0	2026-02-25 14:34:59.601	2026-02-25 17:12:34.669
cmm24yvmc0041epd2on9wba2k	cmm24yvlz003oepd2i52hdihx	cmlzh9diu0005s2k6ujqacuqx	Kellerräumung & Entrümpelung	Keller oder Dachboden muss geräumt werden? Ich helfe beim Sortieren, Tragen und Entsorgen.	hourly	18	tempelhof-schoeneberg	52.47082190179469	13.37532897448689	ACTIVE	{https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&q=80}	{Keller,Entrümpelung,Räumung}	0	0	0	2026-02-25 14:34:59.605	2026-02-25 17:12:34.674
cmm24yvme0043epd2t6v57g6f	cmm24yvlz003oepd2i52hdihx	cmlzh9dix0006s2k6yipho9iy	Balkon bepflanzen & gestalten	Ich bepflanze und gestalte deinen Balkon oder deine Terrasse. Saisonal oder ganzjährig.	fixed	60	tempelhof-schoeneberg	52.47697567758777	13.37132420111033	ACTIVE	{https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600&h=400&fit=crop&q=80}	{Balkon,Pflanzen,Gestaltung}	0	0	0	2026-02-25 14:34:59.606	2026-02-25 17:12:34.676
cmm24yvmg0045epd2prtsxo5a	cmm24yvlz003oepd2i52hdihx	cmlzh9dj00007s2k69j29ehtb	Sushi & asiatische Küche	Professionelle Sushi-Zubereitung für Partys und Events. Auch Sushi-Kurs für Gruppen möglich.	fixed	65	tempelhof-schoeneberg	52.47621497129962	13.38640926983292	ACTIVE	{https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&q=80}	{Sushi,Asiatisch,Kurs}	0	0	0	2026-02-25 14:34:59.608	2026-02-25 17:12:34.678
cmm24yvmi0047epd2me0iijct	cmm24yvlz003oepd2i52hdihx	cmlzh9dj20008s2k6kw44rdx0	Massage – Rücken & Ganzkörper	Entspannungsmassage für zuhause. Rücken-, Nacken- und Ganzkörpermassage. Mit eigenem Öl.	hourly	40	tempelhof-schoeneberg	52.46953887348688	13.38750709280049	ACTIVE	{https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop&q=80}	{Massage,Entspannung,Wellness}	0	0	0	2026-02-25 14:34:59.61	2026-02-25 17:12:34.68
cmm24yvmr004depd2ag0nafjn	cmm24yvmm004aepd2as0ux32h	cmlzh9di80000s2k6z65qn0hd	Laminat & Parkett verlegen	Verlegen von Laminat, Parkett und Vinylböden. Schnelle und saubere Arbeit. Untergrund inklusive.	hourly	30	neukoelln	52.48564346512201	13.44297360694028	ACTIVE	{https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop&q=80}	{Boden,Laminat,Parkett}	0	0	0	2026-02-25 14:34:59.619	2026-02-25 17:12:34.685
cmm24yvmv004hepd2694h19vg	cmm24yvmm004aepd2as0ux32h	cmlzh9dik0002s2k69iup0usk	E-Mail-Konto einrichten	Gmail, Outlook, Apple Mail – ich richte deine E-Mail-Konten auf allen Geräten ein.	fixed	20	neukoelln	52.47387897950183	13.42987026599297	ACTIVE	{https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&q=80}	{E-Mail,Setup,Outlook}	0	0	0	2026-02-25 14:34:59.624	2026-02-25 17:12:34.69
cmm24yvmx004jepd2uhvwdnid	cmm24yvmm004aepd2as0ux32h	cmlzh9dio0003s2k6c70cmthm	Klavier & Keyboard Unterricht	Klavierunterricht für Kinder und Erwachsene. Alle Niveaustufen. Mit oder ohne Vorkenntnisse.	hourly	22	neukoelln	52.4724377574284	13.42831464098732	ACTIVE	{https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&q=80}	{Klavier,Keyboard,Musik}	0	0	0	2026-02-25 14:34:59.625	2026-02-25 17:12:34.692
cmm24yvmz004lepd2vw7akiy2	cmm24yvmm004aepd2as0ux32h	cmlzh9dir0004s2k6juws5z3c	Geburtstagsfeiern für Kinder organisieren	Ich organisiere und begleite Kindergeburtstage. Spiele, Bastelideen und viel Spaß für die Kleinen.	fixed	80	neukoelln	52.47892064040951	13.43689833148303	ACTIVE	{https://images.unsplash.com/photo-1543342384-1f1350e27861?w=600&h=400&fit=crop&q=80}	{Geburtstag,Party,Kinder}	0	0	0	2026-02-25 14:34:59.627	2026-02-25 17:12:34.694
cmm24yvn0004nepd26lcjl4zy	cmm24yvmm004aepd2as0ux32h	cmlzh9diu0005s2k6ujqacuqx	IKEA-Abholung & Lieferung	Kein Auto für IKEA? Ich hole deine Bestellung ab und liefere direkt zu dir nach Hause.	fixed	50	neukoelln	52.49054796811083	13.44519679483231	ACTIVE	{https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&h=400&fit=crop&q=80}	{IKEA,Abholung,Lieferung}	0	0	0	2026-02-25 14:34:59.629	2026-02-25 17:12:34.696
cmm24yvn4004repd2453vbx0t	cmm24yvmm004aepd2as0ux32h	cmlzh9dj00007s2k69j29ehtb	Babybrei selbst kochen – Kochkurs	Ich zeige jungen Eltern, wie man frischen, gesunden Babybrei zubereitet. Schonend und lecker.	fixed	30	neukoelln	52.47981655802161	13.43647733227857	ACTIVE	{https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop&q=80}	{Baby,Babybrei,Gesund}	0	0	0	2026-02-25 14:34:59.633	2026-02-25 17:12:34.701
cmm24yvn6004tepd2hq9qkefu	cmm24yvmm004aepd2as0ux32h	cmlzh9dj20008s2k6kw44rdx0	Haare färben & Strähnen	Haare neu färben, Balayage, Highlights oder Strähnen. Mobile Friseurin mit Profi-Produkten.	negotiable	\N	neukoelln	52.47868867689173	13.44235595980033	ACTIVE	{https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop&q=80}	{Färben,Strähnen,Balayage}	0	0	0	2026-02-25 14:34:59.634	2026-02-25 17:12:34.704
cmm24yvn8004vepd2lni7k9d5	cmm24yvmm004aepd2as0ux32h	cmlzh9dj50009s2k6u9vced7v	Party & Event dekorieren	Ich dekoriere Geburtstage, Hochzeiten und Feiern. Luftballons, Tische, Beleuchtung – alles dabei.	negotiable	\N	neukoelln	52.48469898615165	13.44178626243345	ACTIVE	{https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&q=80}	{Deko,Party,Event}	0	0	0	2026-02-25 14:34:59.636	2026-02-25 17:12:34.706
cmm24yvnh0051epd2ciy6d4ou	cmm24yvnb004wepd2u89ec72a	cmlzh9dig0001s2k65rzvx31u	Frühjahrsputz komplett	Kompletter Frühjahrsputz: Schränke ausräumen, Böden wischen, Fenster putzen, Bad schrubben. Alles sauber.	negotiable	\N	treptow-koepenick	52.45154126683499	13.57890887403683	ACTIVE	{https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop&q=80}	{Frühjahrsputz,Reinigung,Komplett}	0	0	0	2026-02-25 14:34:59.645	2026-02-25 17:12:34.711
cmm24yvnj0053epd27doew291	cmm24yvnb004wepd2u89ec72a	cmlzh9dik0002s2k69iup0usk	Smart Home einrichten	Alexa, Google Home, smarte Lampen und Steckdosen – ich richte dein Smart Home ein und erkläre alles.	hourly	30	treptow-koepenick	52.45054443620033	13.57188655906582	ACTIVE	{https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop&q=80}	{"Smart Home",Alexa,IoT}	0	0	0	2026-02-25 14:34:59.648	2026-02-25 17:12:34.713
cmm24yvnm0055epd2ljaa9la7	cmm24yvnb004wepd2u89ec72a	cmlzh9dio0003s2k6c70cmthm	Hausaufgabenhilfe für Grundschüler	Tägliche Hausaufgabenhilfe für Kinder der 1.–4. Klasse. Geduldig, liebevoll und strukturiert.	hourly	15	treptow-koepenick	52.45932155729644	13.56742254074948	ACTIVE	{https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&q=80}	{Grundschule,Hausaufgaben,Kinder}	0	0	0	2026-02-25 14:34:59.65	2026-02-25 17:12:34.716
cmm24yvno0057epd2bzjadr0e	cmm24yvnb004wepd2u89ec72a	cmlzh9dir0004s2k6juws5z3c	Wochenend-Babysitting	Ihr habt Pläne am Wochenende? Ich passe auf eure Kinder auf. Mit Erfahrung und viel Geduld.	hourly	13	treptow-koepenick	52.45547001130523	13.57773063598357	ACTIVE	{https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop&q=80}	{Wochenende,Babysitting,Eltern}	0	0	0	2026-02-25 14:34:59.653	2026-02-25 17:12:34.718
cmm24yvnt005bepd2gfy3tgly	cmm24yvnb004wepd2u89ec72a	cmlzh9dix0006s2k6yipho9iy	Kompost anlegen & Erde verbessern	Ich lege einen Kompost an und verbessere die Gartenerde mit organischem Material.	fixed	40	treptow-koepenick	52.45447404003676	13.56809460481401	ACTIVE	{https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&h=400&fit=crop&q=80}	{Kompost,Boden,Ökologisch}	0	0	0	2026-02-25 14:34:59.657	2026-02-25 17:12:34.724
cmm24yvnv005depd2xesnjlkl	cmm24yvnb004wepd2u89ec72a	cmlzh9dj00007s2k69j29ehtb	Brot & Gebäck selber backen	Kochkurs: Sauerteigbrot, Brötchen und Gebäck backen. Kein Bäcker nötig – einfacher als du denkst!	fixed	35	treptow-koepenick	52.46221686924425	13.56464707041049	ACTIVE	{https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80}	{Brot,Backen,Kurs}	0	0	0	2026-02-25 14:34:59.659	2026-02-25 17:12:34.726
cmm24yvnx005fepd2nimj74be	cmm24yvnb004wepd2u89ec72a	cmlzh9dj20008s2k6kw44rdx0	Kosmetik & Gesichtsbehandlung	Reinigung, Peeling, Maske und Pflege für dein Gesicht. Entspannt und verwöhnt in einer Stunde.	fixed	50	treptow-koepenick	52.45813181617541	13.57810960218008	ACTIVE	{https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=400&fit=crop&q=80}	{Kosmetik,Gesicht,Peeling}	0	0	0	2026-02-25 14:34:59.662	2026-02-25 17:12:34.729
cmm24yvo9005nepd2loei81d9	cmm24yvo3005iepd2azi8a828	cmlzh9dig0001s2k65rzvx31u	Küche entkalken & desinfizieren	Kalk an Armaturen, Fliesen und Geräten entfernen. Hygienische Desinfektion der gesamten Küche.	fixed	40	marzahn-hellersdorf	52.54875429177911	13.59861755540843	ACTIVE	{https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop&q=80}	{Küche,Entkalken,Desinfektion}	0	0	0	2026-02-25 14:34:59.674	2026-02-25 17:12:34.736
cmm24yvob005pepd23zadumrt	cmm24yvo3005iepd2azi8a828	cmlzh9dik0002s2k69iup0usk	Altes Laptop beschleunigen	SSD einbauen, RAM erweitern, Windows neu installieren – dein alter Laptop wird wieder schnell.	negotiable	\N	marzahn-hellersdorf	52.54730257001604	13.58997754905105	ACTIVE	{https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop&q=80}	{Laptop,Optimierung,SSD}	0	0	0	2026-02-25 14:34:59.676	2026-02-25 17:12:34.739
cmm24yvoe005repd2ux23nsdo	cmm24yvo3005iepd2azi8a828	cmlzh9dio0003s2k6c70cmthm	BWL & VWL für Studenten	Nachhilfe in Betriebswirtschaft und Volkswirtschaft. Klausurvorbereitung und Verständnishilfe.	hourly	25	marzahn-hellersdorf	52.53274909729679	13.60428351859292	ACTIVE	{https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&q=80}	{BWL,Studium,Nachhilfe}	0	0	0	2026-02-25 14:34:59.678	2026-02-25 17:12:34.74
cmm24yvog005tepd2brliqa7i	cmm24yvo3005iepd2azi8a828	cmlzh9dir0004s2k6juws5z3c	Zweisprachige Kinderbetreuung (DE/EN)	Ich betreue Kinder auf Deutsch und Englisch. Ideal für internationale Familien oder zum Sprachenlernen.	hourly	14	marzahn-hellersdorf	52.53438684253061	13.59376863898832	ACTIVE	{https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop&q=80}	{Zweisprachig,Englisch,Kinder}	0	0	0	2026-02-25 14:34:59.681	2026-02-25 17:12:34.742
cmm24yvok005xepd2l7e83grp	cmm24yvo3005iepd2azi8a828	cmlzh9dix0006s2k6yipho9iy	Wintergarten vorbereiten & Pflanzen einwintern	Pflanzen fachgerecht einwintern, Beete abdecken, Gartenmöbel reinigen und einlagern.	hourly	18	marzahn-hellersdorf	52.53956696648481	13.59214220358465	ACTIVE	{https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&q=80}	{Wintergarten,Einwintern,Herbst}	0	0	0	2026-02-25 14:34:59.684	2026-02-25 17:12:34.747
cmm24yvom005zepd2ouqs2mfd	cmm24yvo3005iepd2azi8a828	cmlzh9dj00007s2k69j29ehtb	Dinner-Party planen & kochen	Ich plane und koche für euer Dinner zu Hause. Menü nach Absprache, Einkauf inklusive.	negotiable	\N	marzahn-hellersdorf	52.54144022911387	13.59207298180293	ACTIVE	{https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=400&fit=crop&q=80}	{Dinner,Party,Kochen}	0	0	0	2026-02-25 14:34:59.687	2026-02-25 17:12:34.748
cmm24yvoo0061epd2q48n2qkc	cmm24yvo3005iepd2azi8a828	cmlzh9dj20008s2k6kw44rdx0	Brautfrisur & Hochzeit-Styling	Komplettes Hochzeit-Styling: Haare, Make-up, Brautjungfern auf Wunsch. Termin frühzeitig buchen.	negotiable	\N	marzahn-hellersdorf	52.54068251934122	13.60588521585174	ACTIVE	{https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop&q=80}	{Brautfrisur,Hochzeit,Styling}	0	0	0	2026-02-25 14:34:59.689	2026-02-25 17:12:34.751
cmm24yvoq0063epd2ok7x3ns5	cmm24yvo3005iepd2azi8a828	cmlzh9dj50009s2k6u9vced7v	Lernhilfe & Studienorganisation	Ich helfe beim Organisieren des Lernstoffs, erstelle Zusammenfassungen und Lernpläne.	hourly	18	marzahn-hellersdorf	52.54703488313408	13.59864611572966	ACTIVE	{https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&h=400&fit=crop&q=80}	{Lernen,Organisation,Studium}	0	0	0	2026-02-25 14:34:59.691	2026-02-25 17:12:34.753
cmm24yvoz0069epd2rgyxs8jw	cmm24yvou0064epd2l6lwjwpu	cmlzh9dig0001s2k65rzvx31u	Wohnungsreinigung – gründlich & zuverlässig	Komplette Wohnungsreinigung inkl. Küche, Bad und Böden. Eigene Reinigungsmittel. Regelmäßig oder einmalig.	hourly	18	lichtenberg	52.51938680558806	13.49688034083223	ACTIVE	{https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&h=400&fit=crop&q=80}	{Reinigung,Haushalt,Putzen}	0	0	0	2026-02-25 14:34:59.7	2026-02-25 17:12:34.758
cmm24yvp2006bepd2nnp289sa	cmm24yvou0064epd2l6lwjwpu	cmlzh9dik0002s2k69iup0usk	PC & Laptop reparieren	Langsamer Rechner, Viren, Abstürze – ich diagnose und repariere. Windows, Mac und Linux.	hourly	30	lichtenberg	52.51342426909457	13.50407081742984	ACTIVE	{https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80}	{Computer,Reparatur,Windows}	0	0	0	2026-02-25 14:34:59.702	2026-02-25 17:12:34.76
cmm24yvp4006depd2a9vrm5q7	cmm24yvou0064epd2l6lwjwpu	cmlzh9dio0003s2k6c70cmthm	Mathe-Nachhilfe (Klasse 5–13)	Erfahrene Lehrerin gibt Nachhilfe in Mathematik. Vom Bruchrechnen bis zur Analysis. Online oder in Pankow.	hourly	20	lichtenberg	52.52341003342354	13.49709945695778	ACTIVE	{https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&q=80}	{Mathe,Nachhilfe,Schule}	0	0	0	2026-02-25 14:34:59.705	2026-02-25 17:12:34.762
cmm24yvp7006fepd2ls9f8v5b	cmm24yvou0064epd2l6lwjwpu	cmlzh9dir0004s2k6juws5z3c	Babysitting abends & am Wochenende	Zuverlässige Babysitterin mit Erfahrung. Ich komme zu euch nach Hause. Auch kurzfristig möglich.	hourly	12	lichtenberg	52.5100097933711	13.49474700060865	ACTIVE	{https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=400&fit=crop&q=80}	{Babysitting,Kinder,Abend}	0	0	0	2026-02-25 14:34:59.707	2026-02-25 17:12:34.765
cmm24yvpb006jepd2y23e62eh	cmm24yvou0064epd2l6lwjwpu	cmlzh9dix0006s2k6yipho9iy	Rasen mähen & Unkraut jäten	Regelmäßige Rasenpflege: Mähen, Kanten schneiden, Unkraut entfernen. Mit eigenem Mäher.	hourly	18	lichtenberg	52.51609643112796	13.50067497736288	ACTIVE	{https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=400&fit=crop&q=80}	{Rasen,Garten,Pflege}	0	0	0	2026-02-25 14:34:59.711	2026-02-25 17:12:34.771
cmm24yvpd006lepd23ixzelc4	cmm24yvou0064epd2l6lwjwpu	cmlzh9dj00007s2k69j29ehtb	Kochen für Partys & Feiern	Ich koche für euer Event bis zu 30 Personen. Deutsche, mediterrane oder internationale Küche.	negotiable	\N	lichtenberg	52.51527793597472	13.49823175881312	ACTIVE	{https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80}	{Party,Kochen,Catering}	0	0	0	2026-02-25 14:34:59.713	2026-02-25 17:12:34.773
cmm24yvpf006nepd24gm08ejc	cmm24yvou0064epd2l6lwjwpu	cmlzh9dj20008s2k6kw44rdx0	Haarschnitt & Styling zu Hause	Mobile Friseurin kommt zu dir. Haarschnitt, Färben, Strähnen. Für Damen und Herren.	fixed	35	lichtenberg	52.5103157332986	13.49818478467732	ACTIVE	{https://images.unsplash.com/photo-1595475884562-073c30d45670?w=600&h=400&fit=crop&q=80}	{Friseur,Haarschnitt,Mobil}	0	0	0	2026-02-25 14:34:59.715	2026-02-25 17:12:34.775
cmm24yvpp006tepd2zu6jvz50	cmm24yvpk006qepd2e146gx9y	cmlzh9di80000s2k6z65qn0hd	Wände streichen & tapezieren	Professionelles Streichen von Wänden und Decken. Tapezieren nach Wunsch. Saubere Arbeit mit eigenen Materialien.	hourly	25	reinickendorf	52.58015022760746	13.34084334780556	ACTIVE	{https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&q=80}	{Malen,Tapezieren,Renovierung}	0	0	0	2026-02-25 14:34:59.725	2026-02-25 17:12:34.779
cmm24yvps006xepd2d9pqfw4u	cmm24yvpk006qepd2e146gx9y	cmlzh9dik0002s2k69iup0usk	WLAN einrichten & optimieren	Kein Internet oder schlechtes Signal? Ich richte deinen Router ein und optimiere die WLAN-Abdeckung.	fixed	40	reinickendorf	52.56996635956676	13.33780320928588	ACTIVE	{https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop&q=80}	{WLAN,Router,Internet}	0	0	0	2026-02-25 14:34:59.729	2026-02-25 17:12:34.784
cmm24yvpu006zepd2ykhsayrz	cmm24yvpk006qepd2e146gx9y	cmlzh9dio0003s2k6c70cmthm	Englisch für Alltag & Beruf	Englischunterricht für Erwachsene. Konversation, Grammatik, Business-Englisch. Flexibel und individuell.	hourly	25	reinickendorf	52.57407202523698	13.33023488288931	ACTIVE	{https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&q=80}	{Englisch,Sprachkurs,Erwachsene}	0	0	0	2026-02-25 14:34:59.73	2026-02-25 17:12:34.786
cmm24yvpv0071epd2n47crpkz	cmm24yvpk006qepd2e146gx9y	cmlzh9dir0004s2k6juws5z3c	Kinderbetreuung ganztags	Ganztagesbetreuung für Kinder von 1–10 Jahren. Spielen, Essen, Schlafen – liebevoll und strukturiert.	hourly	10	reinickendorf	52.58486269718696	13.33257551982591	ACTIVE	{https://images.unsplash.com/photo-1533483595632-c5f0e57a1936?w=600&h=400&fit=crop&q=80}	{Kinderbetreuung,Ganztag,Spielen}	0	0	0	2026-02-25 14:34:59.732	2026-02-25 17:12:34.788
cmm24yvpx0073epd2s6ig2x8o	cmm24yvpk006qepd2e146gx9y	cmlzh9diu0005s2k6ujqacuqx	Möbel auf- und abbauen	Ich baue Möbel sicher ab und wieder auf. Küchen, Schränke, Betten, Regale. Mit Werkzeug.	hourly	25	reinickendorf	52.57289757273932	13.32925023532335	ACTIVE	{https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&q=80}	{Möbel,Aufbau,Abbau}	0	0	0	2026-02-25 14:34:59.734	2026-02-25 17:12:34.79
cmm24yvq10077epd2xlctu9lf	cmm24yvpk006qepd2e146gx9y	cmlzh9dj00007s2k69j29ehtb	Kochkurs für Anfänger	Lerne kochen von Grund auf. Ich bringe dir Grundtechniken und leckere Alltagsrezepte bei.	fixed	40	reinickendorf	52.57422485331667	13.33484814091926	ACTIVE	{https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&q=80}	{Kochkurs,Anfänger,Lernen}	0	0	0	2026-02-25 14:34:59.737	2026-02-25 17:12:34.795
cmm24yvq30079epd23tyx4hww	cmm24yvpk006qepd2e146gx9y	cmlzh9dj20008s2k6kw44rdx0	Maniküre & Gelnägel	Professionelle Maniküre, Gelnägel, Nageldesign. Ich komme zu dir oder du kommst zu mir.	fixed	40	reinickendorf	52.57408003279756	13.33627951083817	ACTIVE	{https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop&q=80}	{Nägel,Maniküre,Gel}	0	0	0	2026-02-25 14:34:59.739	2026-02-25 17:12:34.797
cmm24yvq5007bepd2k3o3vusm	cmm24yvpk006qepd2e146gx9y	cmlzh9dj50009s2k6u9vced7v	Hund ausführen & Tiersitting	Ich führe deinen Hund aus und passe auf Haustiere auf, wenn du weg bist. Mit viel Liebe.	hourly	10	reinickendorf	52.58059385701858	13.33395394109716	ACTIVE	{https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop&q=80}	{Hund,Tiersitting,Gassi}	0	0	0	2026-02-25 14:34:59.741	2026-02-25 17:12:34.8
cmm24yvqf007fepd2xiubnt4y	cmm24yvq8007cepd25s01qu5w	cmlzh9di80000s2k6z65qn0hd	IKEA-Möbel aufbauen	Ich baue alle IKEA-Möbel schnell und korrekt auf. Kein Stress mit Anleitungen – ich mache das für dich.	fixed	40	mitte	52.52251597850136	13.39723653174394	ACTIVE	{https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop&q=80}	{IKEA,Möbelaufbau,Heimwerken}	0	0	0	2026-02-25 14:34:59.751	2026-02-25 17:12:34.802
cmm24yvqj007jepd2idaudujg	cmm24yvq8007cepd25s01qu5w	cmlzh9dik0002s2k69iup0usk	Smartphone-Bildschirm austauschen	Gebrochenes Display? Ich tausche Bildschirme bei den meisten Smartphone-Modellen aus. Schnell und günstig.	fixed	50	mitte	52.52300414783152	13.41304131507692	ACTIVE	{https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&q=80}	{Handy,Display,Reparatur}	0	0	0	2026-02-25 14:34:59.756	2026-02-25 17:12:34.806
cmm24yvqm007lepd2heyb332w	cmm24yvq8007cepd25s01qu5w	cmlzh9dio0003s2k6c70cmthm	Deutsch als Fremdsprache (DAF)	Deutschkurs für Ausländer. Anfänger bis Fortgeschrittene. Geduldig und methodisch.	hourly	22	mitte	52.51655589360236	13.40235277871697	ACTIVE	{https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&q=80}	{Deutsch,DAF,Integration}	0	0	0	2026-02-25 14:34:59.758	2026-02-25 17:12:34.808
cmm24yvqo007nepd2rch1k0tn	cmm24yvq8007cepd25s01qu5w	cmlzh9dir0004s2k6juws5z3c	Ferienbetreuung für Schulkinder	Ich betreue eure Kinder in den Ferien. Ausflüge, Basteln, Spielen – kreatives Ferienprogramm.	hourly	11	mitte	52.51498311804838	13.39968673551602	ACTIVE	{https://images.unsplash.com/photo-1543342384-1f1350e27861?w=600&h=400&fit=crop&q=80}	{Ferien,Schulkind,Betreuung}	0	0	0	2026-02-25 14:34:59.76	2026-02-25 17:12:34.81
cmm24yvqq007pepd2qipb71el	cmm24yvq8007cepd25s01qu5w	cmlzh9diu0005s2k6ujqacuqx	Umzugskartons packen & transportieren	Professionelles Einpacken und Transportieren. Bücher, Geschirr, Elektronik – alles sicher verpackt.	hourly	20	mitte	52.51560359779324	13.40197993789869	ACTIVE	{https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&h=400&fit=crop&q=80}	{Kartons,Packen,Transport}	0	0	0	2026-02-25 14:34:59.762	2026-02-25 17:12:34.812
cmm24yvqt007tepd2udhs0hpq	cmm24yvq8007cepd25s01qu5w	cmlzh9dj00007s2k69j29ehtb	Meal Prep – gesund für die Woche vorkochen	Ich koche gesunde Mahlzeiten für deine ganze Woche vor. Portioniert und fertig zum Aufwärmen.	fixed	80	mitte	52.52906380900826	13.40928581053682	ACTIVE	{https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop&q=80}	{"Meal Prep",Gesund,Vorkochen}	0	0	0	2026-02-25 14:34:59.766	2026-02-25 17:12:34.816
cmm24yvqv007vepd25c758o8l	cmm24yvq8007cepd25s01qu5w	cmlzh9dj20008s2k6kw44rdx0	Wimpernverlängerung & -lifting	Voluminöse Wimpern durch Lifting oder Verlängerung. Lang anhaltend und natürlich wirkend.	fixed	55	mitte	52.5196282177594	13.39600037516242	ACTIVE	{https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop&q=80}	{Wimpern,Lifting,Beauty}	0	0	0	2026-02-25 14:34:59.768	2026-02-25 17:12:34.819
cmm24yvr40081epd205g4pfq6	cmm24yvr0007yepd2jcc20vm6	cmlzh9di80000s2k6z65qn0hd	Kleine Elektroreparaturen	Steckdosen, Lichtschalter, Lampen installieren. Alles nach VDE-Norm. Sichere und saubere Arbeit.	hourly	35	friedrichshain-kreuzberg	52.49284252652009	13.44447585179032	ACTIVE	{https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=400&fit=crop&q=80}	{Elektrik,Lampe,Steckdose}	0	0	0	2026-02-25 14:34:59.776	2026-02-25 17:12:34.823
cmm24yvr60083epd2q6ooiswp	cmm24yvr0007yepd2jcc20vm6	cmlzh9dig0001s2k65rzvx31u	Teppich- und Polsterreinigung	Tiefenreinigung von Teppichen, Sofas und Autositzen. Mit Profi-Gerät. Flecken und Gerüche werden entfernt.	hourly	20	friedrichshain-kreuzberg	52.50558733819448	13.45169551052723	ACTIVE	{https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop&q=80}	{Teppich,Polster,Tiefenreinigung}	0	0	0	2026-02-25 14:34:59.778	2026-02-25 17:12:34.825
cmm24yvr80085epd2f290kmae	cmm24yvr0007yepd2jcc20vm6	cmlzh9dik0002s2k69iup0usk	Drucker einrichten & Probleme lösen	Drucker will nicht drucken? Ich richte ihn ein, installiere Treiber und löse Verbindungsprobleme.	fixed	25	friedrichshain-kreuzberg	52.50404363216791	13.45859031000136	ACTIVE	{https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop&q=80}	{Drucker,Setup,Netzwerk}	0	0	0	2026-02-25 14:34:59.78	2026-02-25 17:12:34.828
cmm24yvrb0089epd22asptk5z	cmm24yvr0007yepd2jcc20vm6	cmlzh9dir0004s2k6juws5z3c	Kita-Ergänzung & Abholdienst	Ich hole Kinder von der Kita oder Schule ab und betreue sie bis zum Feierabend der Eltern.	monthly	300	friedrichshain-kreuzberg	52.50181222816101	13.45350289747399	ACTIVE	{https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop&q=80}	{Kita,Abholen,Nachmittag}	0	0	0	2026-02-25 14:34:59.784	2026-02-25 17:12:34.832
cmm24yvre008bepd2cik45yga	cmm24yvr0007yepd2jcc20vm6	cmlzh9diu0005s2k6ujqacuqx	Sperrmüll entsorgen & Transport	Ich entsorge Sperrmüll, alte Möbel und Elektrogeräte. Auch große Mengen kein Problem.	fixed	80	friedrichshain-kreuzberg	52.4942209289387	13.4526555531884	ACTIVE	{https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop&q=80}	{Sperrmüll,Entsorgung,Transport}	0	0	0	2026-02-25 14:34:59.786	2026-02-25 17:12:34.834
cmm24yvrg008depd2efj2yamm	cmm24yvr0007yepd2jcc20vm6	cmlzh9dix0006s2k6yipho9iy	Baum fällen & Äste entfernen	Kleinere Bäume und störende Äste werden fachgerecht entfernt. Sicherheit steht an erster Stelle.	negotiable	\N	friedrichshain-kreuzberg	52.49733560571319	13.44839051445941	ACTIVE	{https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&h=400&fit=crop&q=80}	{Baum,Fällen,Äste}	0	0	0	2026-02-25 14:34:59.788	2026-02-25 17:12:34.837
cmm24yvri008fepd2cnxc85f0	cmm24yvr0007yepd2jcc20vm6	cmlzh9dj00007s2k69j29ehtb	Geburtstagstorten & Motivtorten backen	Individuelle Torten nach Wunsch: Motivtorten, Naked Cakes, Cupcakes. Mit Bestellung im Voraus.	fixed	60	friedrichshain-kreuzberg	52.50788941998324	13.46182797393226	ACTIVE	{https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80}	{Torte,Geburtstag,Backen}	0	0	0	2026-02-25 14:34:59.79	2026-02-25 17:12:34.84
cmm24yvrm008jepd2br43wvx6	cmm24yvr0007yepd2jcc20vm6	cmlzh9dj50009s2k6u9vced7v	Fahrdienst & Begleitung	Ich fahre dich zu Arztbesuchen, zum Flughafen oder bei Erledigungen. Zuverlässig und pünktlich.	hourly	15	friedrichshain-kreuzberg	52.50706482424343	13.45477508390018	ACTIVE	{https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&q=80}	{Fahrdienst,Transport,Begleitung}	0	0	0	2026-02-25 14:34:59.794	2026-02-25 17:12:34.846
cmm24yvrs008nepd26rle04fh	cmm24yvro008kepd2podd8g66	cmlzh9di80000s2k6z65qn0hd	Badezimmer-Fliesen verlegen	Fachgerechtes Verlegen von Fliesen im Bad und in der Küche. Saubere Fugen garantiert.	negotiable	\N	pankow	52.57084262088914	13.3938585084106	ACTIVE	{https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop&q=80}	{Fliesen,Bad,Renovierung}	0	0	0	2026-02-25 14:34:59.801	2026-02-25 17:12:34.849
cmm24yvru008pepd21vq7z6hq	cmm24yvro008kepd2podd8g66	cmlzh9dig0001s2k65rzvx31u	Büroreinigung – täglich oder wöchentlich	Zuverlässige Büroreinigung auf Vertragsbasis. Frühmorgens oder abends, damit der Betrieb nicht gestört wird.	negotiable	\N	pankow	52.56682675251813	13.40797608611605	ACTIVE	{https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop&q=80}	{Büro,Reinigung,Gewerbe}	0	0	0	2026-02-25 14:34:59.802	2026-02-25 17:12:34.851
cmm24yvrw008repd2orxf5l8r	cmm24yvro008kepd2podd8g66	cmlzh9dik0002s2k69iup0usk	Daten retten & Backup einrichten	Daten verloren? Ich versuche sie zu retten. Ich richte auch automatische Backups ein – damit es nicht wieder passiert.	hourly	35	pankow	52.56122258360008	13.4107434764427	ACTIVE	{https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop&q=80}	{Datenrettung,Backup,Sicherheit}	0	0	0	2026-02-25 14:34:59.804	2026-02-25 17:12:34.853
cmm24yvs0008vepd2ritxpmw0	cmm24yvro008kepd2podd8g66	cmlzh9dir0004s2k6juws5z3c	Erfahrene Tagesmutter	Tagesmutter mit 8 Jahren Erfahrung und pädagogischer Ausbildung. Liebevolle Betreuung in meiner Wohnung.	hourly	9	pankow	52.55981481074281	13.39331285640658	ACTIVE	{https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop&q=80}	{Tagesmutter,Kleinkind,Erziehung}	0	0	0	2026-02-25 14:34:59.808	2026-02-25 17:12:34.858
cmm24yvs1008xepd2bwnho1bh	cmm24yvro008kepd2podd8g66	cmlzh9diu0005s2k6ujqacuqx	Piano & Klavier transportieren	Spezialtransport für Klaviere und Flügel. Mit Fachkenntnissen und dem richtigen Equipment.	negotiable	\N	pankow	52.55801635947135	13.41004545547567	ACTIVE	{https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop&q=80}	{Klavier,Spezialtransport,Umzug}	0	0	0	2026-02-25 14:34:59.81	2026-02-25 17:12:34.859
cmm24yvs4008zepd2cbl7lf8e	cmm24yvro008kepd2podd8g66	cmlzh9dix0006s2k6yipho9iy	Gartengestaltung & Beratung	Ich plane deinen Traumgarten und setze ihn mit dir um. Naturnahe und pflegeleichte Gärten.	hourly	30	pankow	52.55766225725603	13.41279035659454	ACTIVE	{https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&q=80}	{Gestaltung,Planung,Garten}	0	0	0	2026-02-25 14:34:59.812	2026-02-25 17:12:34.862
cmm24yvs50091epd2ml0d1d29	cmm24yvro008kepd2podd8g66	cmlzh9dj00007s2k69j29ehtb	Vegane & vegetarische Küche	Leckeres veganes und vegetarisches Essen zum Bestellen oder als Kochkurs. Nachhaltig und gesund.	hourly	25	pankow	52.56573610849772	13.39621977292646	ACTIVE	{https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=400&fit=crop&q=80}	{Vegan,Vegetarisch,Kochen}	0	0	0	2026-02-25 14:34:59.814	2026-02-25 17:12:34.864
cmm24yvsj0099epd2qz3ca26p	cmm24yvsd0096epd2gaa3evbh	cmlzh9di80000s2k6z65qn0hd	Wasserhahn & Spüle reparieren	Tropfende Wasserhähne, undichte Spülen – ich repariere alles schnell und günstig.	fixed	45	charlottenburg-wilmersdorf	52.50043114385679	13.29506841346991	ACTIVE	{https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80}	{Klempner,Wasserhahn,Sanitär}	0	0	0	2026-02-25 14:34:59.827	2026-02-25 17:12:34.872
cmm24yvsm009bepd23yz57o8b	cmm24yvsd0096epd2gaa3evbh	cmlzh9dig0001s2k65rzvx31u	Backofen & Kühlschrank reinigen	Hartnaäckiger Schmutz im Backofen oder Kühlschrank? Ich reinige gründlich mit umweltfreundlichen Mitteln.	fixed	30	charlottenburg-wilmersdorf	52.50962069322475	13.29469841534127	ACTIVE	{https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&h=400&fit=crop&q=80}	{Küche,Backofen,Reinigung}	0	0	0	2026-02-25 14:34:59.83	2026-02-25 17:12:34.873
cmm24yvsq009depd2swo3noi6	cmm24yvsd0096epd2gaa3evbh	cmlzh9dik0002s2k69iup0usk	Virus & Malware entfernen	Viren, Trojaner, Adware – ich reinige deinen PC gründlich und schütze ihn für die Zukunft.	fixed	45	charlottenburg-wilmersdorf	52.50420444603724	13.29878305896537	ACTIVE	{https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80}	{Virus,Malware,Sicherheit}	0	0	0	2026-02-25 14:34:59.834	2026-02-25 17:12:34.876
cmm24yvss009fepd2a7wvn7s8	cmm24yvsd0096epd2gaa3evbh	cmlzh9dio0003s2k6c70cmthm	Französisch für Schule & Reise	Nachhilfe und Konversationskurs in Französisch. Schüler und Erwachsene. Bei mir oder bei dir.	hourly	22	charlottenburg-wilmersdorf	52.50729565509351	13.30345803586127	ACTIVE	{https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&q=80}	{Französisch,Sprache,Nachhilfe}	0	0	0	2026-02-25 14:34:59.837	2026-02-25 17:12:34.878
cmm24yvsx009jepd2bw184auu	cmm24yvsd0096epd2gaa3evbh	cmlzh9diu0005s2k6ujqacuqx	Studentenumzug günstig	Günstiger Umzugsservice für Studenten. Schnell, zuverlässig und ohne unnötige Extras.	fixed	150	charlottenburg-wilmersdorf	52.50103601621667	13.30836503895728	ACTIVE	{https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&q=80}	{Student,Umzug,Günstig}	0	0	0	2026-02-25 14:34:59.842	2026-02-25 17:12:34.883
cmm24yvt0009lepd2xvx9znbc	cmm24yvsd0096epd2gaa3evbh	cmlzh9dix0006s2k6yipho9iy	Herbstlaub & Gartenabfälle entsorgen	Laub, Äste, Grasschnitt – ich entsorge alle Gartenabfälle sauber und schnell.	hourly	15	charlottenburg-wilmersdorf	52.50257226341906	13.2958531415919	ACTIVE	{https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=400&fit=crop&q=80}	{Laub,Herbst,Entsorgung}	0	0	0	2026-02-25 14:34:59.844	2026-02-25 17:12:34.885
cmm24yvt2009nepd2wacekfcw	cmm24yvsd0096epd2gaa3evbh	cmlzh9dj00007s2k69j29ehtb	Türkische & orientalische Küche	Ich koche authentisches türkisches und orientalisches Essen für euch. Kebab, Meze, Baklava & mehr.	fixed	50	charlottenburg-wilmersdorf	52.51503431413629	13.29572060470169	ACTIVE	{https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80}	{Türkisch,Orientalisch,Catering}	0	0	0	2026-02-25 14:34:59.846	2026-02-25 17:12:34.887
cmm24yvt4009pepd2v6tws4d1	cmm24yvsd0096epd2gaa3evbh	cmlzh9dj20008s2k6kw44rdx0	Pediküre & Fußpflege	Verwöhne deine Füße mit professioneller Pediküre. Hornhaut, Nagelpflege, Lackieren.	fixed	35	charlottenburg-wilmersdorf	52.50990336898481	13.3014429318333	ACTIVE	{https://images.unsplash.com/photo-1595475884562-073c30d45670?w=600&h=400&fit=crop&q=80}	{Pediküre,Füße,Pflege}	0	0	0	2026-02-25 14:34:59.848	2026-02-25 17:12:34.89
cmm24yvtc009vepd2s3rmvbcu	cmm24yvt8009sepd21mmukuss	cmlzh9di80000s2k6z65qn0hd	Gartenhaus aufbauen	Aufbau von Gartenhäusern, Pergolen und Carports. Auch Montage von Sichtschutzzäunen.	negotiable	\N	spandau	52.52877019567686	13.20070929101723	ACTIVE	{https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&q=80}	{Gartenhaus,Holzbau,Montage}	0	0	0	2026-02-25 14:34:59.857	2026-02-25 17:12:34.895
cmm24yvte009xepd25o9o197j	cmm24yvt8009sepd21mmukuss	cmlzh9dig0001s2k65rzvx31u	Keller & Dachboden entrümpeln	Ich helfe beim Sortieren und Entrümpeln von Keller, Dachboden oder Garage. Entsorgung auf Wunsch möglich.	hourly	15	spandau	52.54312366366062	13.19375932027923	ACTIVE	{https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80}	{Entrümpeln,Keller,Aufräumen}	0	0	0	2026-02-25 14:34:59.859	2026-02-25 17:12:34.897
cmm24yvtg009zepd2cnb1nygh	cmm24yvt8009sepd21mmukuss	cmlzh9dik0002s2k69iup0usk	Website erstellen (WordPress)	Einfache und professionelle WordPress-Websites für kleine Unternehmen und Selbstständige.	negotiable	\N	spandau	52.52699134303231	13.19127847582227	ACTIVE	{https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop&q=80}	{Website,WordPress,Online}	0	0	0	2026-02-25 14:34:59.861	2026-02-25 17:12:34.899
cmm24yvti00a1epd2p1adgmbk	cmm24yvt8009sepd21mmukuss	cmlzh9dio0003s2k6c70cmthm	Programmieren lernen (Python & Webdev)	Ich bringe dir Python und Webentwicklung bei. Für Anfänger und Quereinsteiger. Praxisorientiert.	hourly	30	spandau	52.54293505179974	13.18845947735053	ACTIVE	{https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&q=80}	{Programmieren,Python,Coding}	0	0	0	2026-02-25 14:34:59.862	2026-02-25 17:12:34.902
cmm24yvtm00a5epd2ag68ujk0	cmm24yvt8009sepd21mmukuss	cmlzh9diu0005s2k6ujqacuqx	Kellerräumung & Entrümpelung	Keller oder Dachboden muss geräumt werden? Ich helfe beim Sortieren, Tragen und Entsorgen.	hourly	18	spandau	52.52826933407062	13.19564733972982	ACTIVE	{https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&q=80}	{Keller,Entrümpelung,Räumung}	0	0	0	2026-02-25 14:34:59.866	2026-02-25 17:12:34.906
cmm24yvto00a7epd2u2dyuo2s	cmm24yvt8009sepd21mmukuss	cmlzh9dix0006s2k6yipho9iy	Balkon bepflanzen & gestalten	Ich bepflanze und gestalte deinen Balkon oder deine Terrasse. Saisonal oder ganzjährig.	fixed	60	spandau	52.53608916017683	13.19565421748908	ACTIVE	{https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600&h=400&fit=crop&q=80}	{Balkon,Pflanzen,Gestaltung}	0	0	0	2026-02-25 14:34:59.868	2026-02-25 17:12:34.908
cmm24yvtq00a9epd2lerztsly	cmm24yvt8009sepd21mmukuss	cmlzh9dj00007s2k69j29ehtb	Sushi & asiatische Küche	Professionelle Sushi-Zubereitung für Partys und Events. Auch Sushi-Kurs für Gruppen möglich.	fixed	65	spandau	52.53456764150651	13.20064049929994	ACTIVE	{https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&q=80}	{Sushi,Asiatisch,Kurs}	0	0	0	2026-02-25 14:34:59.87	2026-02-25 17:12:34.911
cmm24yvu100ahepd255hs28jp	cmm24yvtx00aeepd27myr702n	cmlzh9di80000s2k6z65qn0hd	Laminat & Parkett verlegen	Verlegen von Laminat, Parkett und Vinylböden. Schnelle und saubere Arbeit. Untergrund inklusive.	hourly	30	steglitz-zehlendorf	52.42571086623168	13.25881473610503	ACTIVE	{https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop&q=80}	{Boden,Laminat,Parkett}	0	0	0	2026-02-25 14:34:59.881	2026-02-25 17:12:34.919
cmm24yvu300ajepd2jbeoaadb	cmm24yvtx00aeepd27myr702n	cmlzh9dig0001s2k65rzvx31u	Wäsche waschen & bügeln	Du hast keine Zeit zum Waschen und Bügeln? Ich übernehme das gerne. Abholung und Lieferung möglich.	hourly	12	steglitz-zehlendorf	52.43293268433129	13.2477310728925	ACTIVE	{https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&h=400&fit=crop&q=80}	{Wäsche,Bügeln,Haushalt}	0	0	0	2026-02-25 14:34:59.883	2026-02-25 17:12:34.921
cmm24yvu500alepd2hfef09au	cmm24yvtx00aeepd27myr702n	cmlzh9dik0002s2k69iup0usk	E-Mail-Konto einrichten	Gmail, Outlook, Apple Mail – ich richte deine E-Mail-Konten auf allen Geräten ein.	fixed	20	steglitz-zehlendorf	52.43404189619262	13.25929060670776	ACTIVE	{https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&q=80}	{E-Mail,Setup,Outlook}	0	0	0	2026-02-25 14:34:59.885	2026-02-25 17:12:34.925
cmm24yvu600anepd2s2sc7gdg	cmm24yvtx00aeepd27myr702n	cmlzh9dio0003s2k6c70cmthm	Klavier & Keyboard Unterricht	Klavierunterricht für Kinder und Erwachsene. Alle Niveaustufen. Mit oder ohne Vorkenntnisse.	hourly	22	steglitz-zehlendorf	52.42608448756134	13.25228529994442	ACTIVE	{https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&q=80}	{Klavier,Keyboard,Musik}	0	0	0	2026-02-25 14:34:59.887	2026-02-25 17:12:34.927
cmm24yvub00arepd2vywih1h4	cmm24yvtx00aeepd27myr702n	cmlzh9diu0005s2k6ujqacuqx	IKEA-Abholung & Lieferung	Kein Auto für IKEA? Ich hole deine Bestellung ab und liefere direkt zu dir nach Hause.	fixed	50	steglitz-zehlendorf	52.43247558680551	13.24001054390636	ACTIVE	{https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&h=400&fit=crop&q=80}	{IKEA,Abholung,Lieferung}	0	0	0	2026-02-25 14:34:59.891	2026-02-25 17:12:34.931
cmm24yvud00atepd2hvvvv33z	cmm24yvtx00aeepd27myr702n	cmlzh9dix0006s2k6yipho9iy	Bewässerungssystem installieren	Automatische Bewässerung für Garten und Balkon. Tröpfchensysteme und Zeitschaltuhren.	negotiable	\N	steglitz-zehlendorf	52.42646902655441	13.2451027568906	ACTIVE	{https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&q=80}	{Bewässerung,Installation,Automatisch}	0	0	0	2026-02-25 14:34:59.893	2026-02-25 17:12:34.933
cmm24yvuf00avepd2977hg8jo	cmm24yvtx00aeepd27myr702n	cmlzh9dj00007s2k69j29ehtb	Babybrei selbst kochen – Kochkurs	Ich zeige jungen Eltern, wie man frischen, gesunden Babybrei zubereitet. Schonend und lecker.	fixed	30	steglitz-zehlendorf	52.43205299059616	13.25724874975641	ACTIVE	{https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop&q=80}	{Baby,Babybrei,Gesund}	0	0	0	2026-02-25 14:34:59.895	2026-02-25 17:12:34.935
cmm24yvuh00axepd2wllmnhw5	cmm24yvtx00aeepd27myr702n	cmlzh9dj20008s2k6kw44rdx0	Haare färben & Strähnen	Haare neu färben, Balayage, Highlights oder Strähnen. Mobile Friseurin mit Profi-Produkten.	negotiable	\N	steglitz-zehlendorf	52.43117431830101	13.24977916950482	ACTIVE	{https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop&q=80}	{Färben,Strähnen,Balayage}	0	0	0	2026-02-25 14:34:59.897	2026-02-25 17:12:34.937
cmm24yvut00b3epd2mn8ll8vi	cmm24yvuo00b0epd23vthjfsx	cmlzh9di80000s2k6z65qn0hd	Fenster & Türen abdichten	Zugluft und Wärmeverlust durch undichte Fenster und Türen vermeiden. Ich dichte alles fachgerecht ab.	fixed	50	tempelhof-schoeneberg	52.47433496978621	13.37164465619619	ACTIVE	{https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=400&fit=crop&q=80}	{Fenster,Dichten,Energiesparen}	0	0	0	2026-02-25 14:34:59.91	2026-02-25 17:12:34.942
cmm24yvuw00b5epd2qkcvr60q	cmm24yvuo00b0epd23vthjfsx	cmlzh9dig0001s2k65rzvx31u	Frühjahrsputz komplett	Kompletter Frühjahrsputz: Schränke ausräumen, Böden wischen, Fenster putzen, Bad schrubben. Alles sauber.	negotiable	\N	tempelhof-schoeneberg	52.46909454856441	13.39019511888602	ACTIVE	{https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop&q=80}	{Frühjahrsputz,Reinigung,Komplett}	0	0	0	2026-02-25 14:34:59.912	2026-02-25 17:12:34.944
cmm24yvuy00b7epd2fws3z4bp	cmm24yvuo00b0epd23vthjfsx	cmlzh9dik0002s2k69iup0usk	Smart Home einrichten	Alexa, Google Home, smarte Lampen und Steckdosen – ich richte dein Smart Home ein und erkläre alles.	hourly	30	tempelhof-schoeneberg	52.46898870895748	13.38940930825324	ACTIVE	{https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop&q=80}	{"Smart Home",Alexa,IoT}	0	0	0	2026-02-25 14:34:59.915	2026-02-25 17:12:34.947
cmm24yvv000b9epd2hwkde45g	cmm24yvuo00b0epd23vthjfsx	cmlzh9dio0003s2k6c70cmthm	Hausaufgabenhilfe für Grundschüler	Tägliche Hausaufgabenhilfe für Kinder der 1.–4. Klasse. Geduldig, liebevoll und strukturiert.	hourly	15	tempelhof-schoeneberg	52.46733730740442	13.38238019793669	ACTIVE	{https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&q=80}	{Grundschule,Hausaufgaben,Kinder}	0	0	0	2026-02-25 14:34:59.917	2026-02-25 17:12:34.948
cmm24yvv400bdepd2pmpwfeun	cmm24yvuo00b0epd23vthjfsx	cmlzh9diu0005s2k6ujqacuqx	Möbel lagern & einlagern	Du brauchst temporären Stauraum? Ich biete Einlagerung von Möbeln und Kartons für kurze Zeit.	monthly	60	tempelhof-schoeneberg	52.47668268089762	13.37236826775307	ACTIVE	{https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop&q=80}	{Lager,Einlagern,Möbel}	0	0	0	2026-02-25 14:34:59.92	2026-02-25 17:12:34.953
cmm24yvv600bfepd2mkebytsc	cmm24yvuo00b0epd23vthjfsx	cmlzh9dix0006s2k6yipho9iy	Kompost anlegen & Erde verbessern	Ich lege einen Kompost an und verbessere die Gartenerde mit organischem Material.	fixed	40	tempelhof-schoeneberg	52.46497557020688	13.38977521162036	ACTIVE	{https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&h=400&fit=crop&q=80}	{Kompost,Boden,Ökologisch}	0	0	0	2026-02-25 14:34:59.922	2026-02-25 17:12:34.956
cmm24yvv800bhepd2jwctchj2	cmm24yvuo00b0epd23vthjfsx	cmlzh9dj00007s2k69j29ehtb	Brot & Gebäck selber backen	Kochkurs: Sauerteigbrot, Brötchen und Gebäck backen. Kein Bäcker nötig – einfacher als du denkst!	fixed	35	tempelhof-schoeneberg	52.46090291376442	13.37211157371451	ACTIVE	{https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80}	{Brot,Backen,Kurs}	0	0	0	2026-02-25 14:34:59.924	2026-02-25 17:12:34.958
cmm220jop000jquhpsi6d2sv0	cmm220jna0000quhp2nvxeuhz	cmlzh9dj00007s2k69j29ehtb	Turkisches Essen kochen	Ich koche authentische turkische Gerichte fur Partys und Veranstaltungen.	FIXED	60	tempelhof-schoeneberg	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.601	2026-02-25 17:12:34.493
cmm220joz000rquhpfmmxxccn	cmm220jna0000quhp2nvxeuhz	cmlzh9dig0001s2k65rzvx31u	Buroreinigung & Fensterputzen	Gewerbliche Reinigung, Fenster putzen, Treppenhauber saubern.	HOURLY	20	mitte	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.611	2026-02-25 17:12:34.502
cmm220jp1000tquhpy8unp1pc	cmm220jna0000quhp2nvxeuhz	cmlzh9dik0002s2k69iup0usk	Smartphone-Bildschirm tauschen	Display-Reparatur fur iPhone und Android. Schnell erledigt, Ersatzteile dabei.	FIXED	80	pankow	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.614	2026-02-25 17:12:34.508
cmm220jpa000xquhpa3n06hz1	cmm220jna0000quhp2nvxeuhz	cmlzh9diu0005s2k6ujqacuqx	Umzugshelfer – ich helfe!	Kraftige Unterstutzung beim Umzug. Tragen, einpacken, transportieren.	HOURLY	18	treptow-koepenick	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.623	2026-02-25 17:12:34.512
cmm220jpk0015quhpy9wyciq1	cmm220jna0000quhp2nvxeuhz	cmlzh9dik0002s2k69iup0usk	WLAN einrichten & Netzwerk	Router einrichten, WLAN optimieren, Smart-Home-Gerate verbinden.	FIXED	35	steglitz-zehlendorf	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.632	2026-02-25 17:12:34.523
cmm220jpu001dquhpprj41o2l	cmm220jna0000quhp2nvxeuhz	cmlzh9dj50009s2k6u9vced7v	Tiersitting - Hund & Katze	Ich passe auf Ihren Hund oder Ihre Katze auf, wenn Sie verreisen.	DAILY	30	pankow	\N	\N	ACTIVE	{https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&q=80}	{}	0	0	0	2026-02-25 13:12:18.642	2026-02-25 17:12:34.531
cmm24yvvc00blepd2jsfgqbwe	cmm24yvuo00b0epd23vthjfsx	cmlzh9dj50009s2k6u9vced7v	Schlange stehen & Termine wahrnehmen	Keine Zeit für Behörden, Arzt oder lange Warteschlangen? Ich erledige das für dich.	hourly	12	tempelhof-schoeneberg	52.47515860075598	13.37380362477273	ACTIVE	{https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&q=80}	{Warten,Termine,Behörden}	0	0	0	2026-02-25 14:34:59.928	2026-02-25 17:12:34.963
cmm24yvvi00bpepd2n8j1h4y3	cmm24yvvf00bmepd2hwfphp4y	cmlzh9di80000s2k6z65qn0hd	Rolladen & Jalousien reparieren	Kaputte Rolladen, klemmenede Jalousien – ich repariere und tausche aus. Alle Typen.	fixed	55	neukoelln	52.47761287627532	13.43379419224154	ACTIVE	{https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop&q=80}	{Rolladen,Jalousie,Reparatur}	0	0	0	2026-02-25 14:34:59.935	2026-02-25 17:12:34.966
cmm24yvvk00brepd2m2cn1deb	cmm24yvvf00bmepd2hwfphp4y	cmlzh9dig0001s2k65rzvx31u	Küche entkalken & desinfizieren	Kalk an Armaturen, Fliesen und Geräten entfernen. Hygienische Desinfektion der gesamten Küche.	fixed	40	neukoelln	52.47173707175377	13.43510716250772	ACTIVE	{https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop&q=80}	{Küche,Entkalken,Desinfektion}	0	0	0	2026-02-25 14:34:59.937	2026-02-25 17:12:34.968
cmm24yvvm00btepd2qvqt17ac	cmm24yvvf00bmepd2hwfphp4y	cmlzh9dik0002s2k69iup0usk	Altes Laptop beschleunigen	SSD einbauen, RAM erweitern, Windows neu installieren – dein alter Laptop wird wieder schnell.	negotiable	\N	neukoelln	52.47757259523175	13.44274519460327	ACTIVE	{https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop&q=80}	{Laptop,Optimierung,SSD}	0	0	0	2026-02-25 14:34:59.939	2026-02-25 17:12:34.97
cmm24yvvq00bxepd2w41lasd5	cmm24yvvf00bmepd2hwfphp4y	cmlzh9dir0004s2k6juws5z3c	Zweisprachige Kinderbetreuung (DE/EN)	Ich betreue Kinder auf Deutsch und Englisch. Ideal für internationale Familien oder zum Sprachenlernen.	hourly	14	neukoelln	52.48390854658723	13.43725792050277	ACTIVE	{https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop&q=80}	{Zweisprachig,Englisch,Kinder}	0	0	0	2026-02-25 14:34:59.942	2026-02-25 17:12:34.975
cmm24yvvs00bzepd2bu18rl44	cmm24yvvf00bmepd2hwfphp4y	cmlzh9diu0005s2k6ujqacuqx	Umzug im Haus (Etagen)	Möbel innerhalb eines Gebäudes von Etage zu Etage tragen. Auch ohne Aufzug schnell erledigt.	hourly	20	neukoelln	52.48450797808199	13.43481915333515	ACTIVE	{https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop&q=80}	{Etagen,intern,Möbel}	0	0	0	2026-02-25 14:34:59.944	2026-02-25 17:12:34.977
cmm24yvvu00c1epd2g2rkyb77	cmm24yvvf00bmepd2hwfphp4y	cmlzh9dix0006s2k6yipho9iy	Wintergarten vorbereiten & Pflanzen einwintern	Pflanzen fachgerecht einwintern, Beete abdecken, Gartenmöbel reinigen und einlagern.	hourly	18	neukoelln	52.48009937075229	13.4451506998099	ACTIVE	{https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&q=80}	{Wintergarten,Einwintern,Herbst}	0	0	0	2026-02-25 14:34:59.946	2026-02-25 17:12:34.98
cmm24yvvw00c3epd2nxc3tpt2	cmm24yvvf00bmepd2hwfphp4y	cmlzh9dj00007s2k69j29ehtb	Dinner-Party planen & kochen	Ich plane und koche für euer Dinner zu Hause. Menü nach Absprache, Einkauf inklusive.	negotiable	\N	neukoelln	52.49024145356519	13.4340830388337	ACTIVE	{https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=400&fit=crop&q=80}	{Dinner,Party,Kochen}	0	0	0	2026-02-25 14:34:59.948	2026-02-25 17:12:34.982
cmm24yvw000c7epd2qz26ejiu	cmm24yvvf00bmepd2hwfphp4y	cmlzh9dj50009s2k6u9vced7v	Lernhilfe & Studienorganisation	Ich helfe beim Organisieren des Lernstoffs, erstelle Zusammenfassungen und Lernpläne.	hourly	18	neukoelln	52.49055494123686	13.43219714529339	ACTIVE	{https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&h=400&fit=crop&q=80}	{Lernen,Organisation,Studium}	0	0	0	2026-02-25 14:34:59.953	2026-02-25 17:12:34.987
cmm24yviv0011epd28t85ttbw	cmm24yvif000mepd2lqt0u2pj	cmlzh9dix0006s2k6yipho9iy	Heckenschnitt professionell	Ich schneide Hecken, Sträucher und Büsche in Form. Ordentlich und sauber. Schnittgut wird entsorgt.	fixed	50	friedrichshain-kreuzberg	52.50665627649345	13.44800448244477	ACTIVE	{https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=400&fit=crop&q=80}	{Hecke,Schnitt,Garten}	0	5	1	2026-02-25 14:34:59.479	2026-02-25 17:12:34.989
cmm24yvhr0003epd2meig8cnm	cmm24yvh50000epd25psjcjkt	cmlzh9di80000s2k6z65qn0hd	Türschloss reparieren & öffnen	Ich öffne Türen bei Schlüsselverlust und tausche Schlösser aus. Schnell und diskret. Auch abends erreichbar.	fixed	60	mitte	52.5266750188818	13.41221380991701	ACTIVE	{https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80}	{Schlüsseldienst,Schloss,Notfall}	0	0	0	2026-02-25 14:34:59.44	2026-02-25 17:12:34.537
cmm24yvi4000depd2gjlv1cdc	cmm24yvh50000epd25psjcjkt	cmlzh9diu0005s2k6ujqacuqx	Umzugshelfer mit LKW	Ich helfe beim Umzug mit einem 7,5t-LKW. Auch Möbeltransporte innerhalb Berlins. Inkl. Be- und Entladen.	hourly	45	mitte	52.5260033707247	13.40764372476947	ACTIVE	{https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&q=80}	{Umzug,LKW,Transport}	0	0	0	2026-02-25 14:34:59.452	2026-02-25 17:12:34.549
cmm24yvic000lepd286dkak0y	cmm24yvh50000epd25psjcjkt	cmlzh9dj50009s2k6u9vced7v	Einkaufen & Erledigungen für Senioren	Ich erledige Einkäufe, Behördengänge und Arztbesuche für ältere Menschen. Geduldig und zuverlässig.	hourly	12	mitte	52.52730260196633	13.4071078620464	ACTIVE	{https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop&q=80}	{Senioren,Einkauf,Hilfe}	0	0	0	2026-02-25 14:34:59.46	2026-02-25 17:12:34.557
cmm24yvij000pepd2mxrv85g6	cmm24yvif000mepd2lqt0u2pj	cmlzh9di80000s2k6z65qn0hd	Wände streichen & tapezieren	Professionelles Streichen von Wänden und Decken. Tapezieren nach Wunsch. Saubere Arbeit mit eigenen Materialien.	hourly	25	friedrichshain-kreuzberg	52.50649156029306	13.45416614233282	ACTIVE	{https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&q=80}	{Malen,Tapezieren,Renovierung}	0	0	0	2026-02-25 14:34:59.467	2026-02-25 17:12:34.56
cmm24yvit000zepd22231w8xj	cmm24yvif000mepd2lqt0u2pj	cmlzh9diu0005s2k6ujqacuqx	Möbel auf- und abbauen	Ich baue Möbel sicher ab und wieder auf. Küchen, Schränke, Betten, Regale. Mit Werkzeug.	hourly	25	friedrichshain-kreuzberg	52.50191192313957	13.44621416580706	ACTIVE	{https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&q=80}	{Möbel,Aufbau,Abbau}	0	0	0	2026-02-25 14:34:59.478	2026-02-25 17:12:34.571
cmm24yvja001depd2yoow3bg6	cmm24yvj30018epd2rxi8qgi4	cmlzh9dig0001s2k65rzvx31u	Umzugsreinigung mit Übergabegarantie	Professionelle End- und Einzugsreinigung für Mietkautionsrückgabe. Mit Endreinigungsgarantie.	negotiable	\N	pankow	52.5727730619579	13.40569898459125	ACTIVE	{https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&h=400&fit=crop&q=80}	{Umzug,Endreinigung,Kaution}	0	0	0	2026-02-25 14:34:59.495	2026-02-25 17:12:34.582
cmm24yvjl001nepd20tg4bdh7	cmm24yvj30018epd2rxi8qgi4	cmlzh9dix0006s2k6yipho9iy	Gartenbeet anlegen & bepflanzen	Ich lege Beete an, bereite den Boden vor und bepflanze nach deinen Wünschen. Gemüse oder Blumen.	hourly	20	pankow	52.56137084750079	13.40826132094094	ACTIVE	{https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&q=80}	{Beet,Pflanzen,Garten}	0	0	0	2026-02-25 14:34:59.505	2026-02-25 17:12:34.593
cmm24yvjy001xepd2w2kil8kq	cmm24yvju001uepd2rqzak6lb	cmlzh9di80000s2k6z65qn0hd	Kleine Elektroreparaturen	Steckdosen, Lichtschalter, Lampen installieren. Alles nach VDE-Norm. Sichere und saubere Arbeit.	hourly	35	charlottenburg-wilmersdorf	52.50032021927875	13.29423270079529	ACTIVE	{https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=400&fit=crop&q=80}	{Elektrik,Lampe,Steckdose}	0	0	0	2026-02-25 14:34:59.519	2026-02-25 17:12:34.601
cmm24yvk80025epd2cr3o5swz	cmm24yvju001uepd2rqzak6lb	cmlzh9dir0004s2k6juws5z3c	Kita-Ergänzung & Abholdienst	Ich hole Kinder von der Kita oder Schule ab und betreue sie bis zum Feierabend der Eltern.	monthly	300	charlottenburg-wilmersdorf	52.50384188243777	13.3106611873207	ACTIVE	{https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop&q=80}	{Kita,Abholen,Nachmittag}	0	0	0	2026-02-25 14:34:59.529	2026-02-25 17:12:34.61
cmm24yvkj002fepd22r3px7g7	cmm24yvju001uepd2rqzak6lb	cmlzh9dj50009s2k6u9vced7v	Fahrdienst & Begleitung	Ich fahre dich zu Arztbesuchen, zum Flughafen oder bei Erledigungen. Zuverlässig und pünktlich.	hourly	15	charlottenburg-wilmersdorf	52.51012621163887	13.30313026811606	ACTIVE	{https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&q=80}	{Fahrdienst,Transport,Begleitung}	0	0	0	2026-02-25 14:34:59.54	2026-02-25 17:12:34.62
cmm24yvky002repd2iv5lwfs9	cmm24yvkm002gepd2d3a8fzdx	cmlzh9dir0004s2k6juws5z3c	Erfahrene Tagesmutter	Tagesmutter mit 8 Jahren Erfahrung und pädagogischer Ausbildung. Liebevolle Betreuung in meiner Wohnung.	hourly	9	spandau	52.52569040287072	13.20368071700289	ACTIVE	{https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop&q=80}	{Tagesmutter,Kleinkind,Erziehung}	0	0	0	2026-02-25 14:34:59.555	2026-02-25 17:12:34.629
cmm24yvl80031epd2qwejgrm5	cmm24yvkm002gepd2d3a8fzdx	cmlzh9dj50009s2k6u9vced7v	Buchhaltung & Steuererklärung	Ich helfe bei der jährlichen Steuererklärung und einfacher Buchführung für Selbstständige.	hourly	35	spandau	52.53330015676674	13.20014487931572	ACTIVE	{https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&h=400&fit=crop&q=80}	{Steuern,Buchhaltung,Finanzen}	0	0	0	2026-02-25 14:34:59.564	2026-02-25 17:12:34.639
cmm24yvlf0035epd2hexu76ax	cmm24yvla0032epd2ov7motu5	cmlzh9di80000s2k6z65qn0hd	Wasserhahn & Spüle reparieren	Tropfende Wasserhähne, undichte Spülen – ich repariere alles schnell und günstig.	fixed	45	steglitz-zehlendorf	52.43146692666684	13.24413521017432	ACTIVE	{https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80}	{Klempner,Wasserhahn,Sanitär}	0	0	0	2026-02-25 14:34:59.571	2026-02-25 17:12:34.642
cmm24yvlm003depd25ua9zd03	cmm24yvla0032epd2ov7motu5	cmlzh9dir0004s2k6juws5z3c	Babysitten für Säuglinge (0–12 Monate)	Spezialisiert auf Säuglingspflege. Ich betreue Babys liebevoll und erfahren. Auch Nachts.	hourly	14	steglitz-zehlendorf	52.42509696333472	13.25480663553839	ACTIVE	{https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=400&fit=crop&q=80}	{Säugling,Baby,Nacht}	0	0	0	2026-02-25 14:34:59.579	2026-02-25 17:12:34.65
cmm24yvlw003nepd2v8z4ji1a	cmm24yvla0032epd2ov7motu5	cmlzh9dj50009s2k6u9vced7v	Fotoshooting für Bewerbung & LinkedIn	Professionelle Bewerbungsfotos und LinkedIn-Portraits. Studio oder outdoor. Schnelle Lieferung.	fixed	60	steglitz-zehlendorf	52.42640638025174	13.24269190281687	ACTIVE	{https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop&q=80}	{Foto,Bewerbung,Portrait}	0	0	0	2026-02-25 14:34:59.589	2026-02-25 17:12:34.66
cmm24yvmb003zepd2psytzn3c	cmm24yvlz003oepd2i52hdihx	cmlzh9dir0004s2k6juws5z3c	Kinder abholen & Hausaufgaben betreuen	Nachmittagsbetreuung: Schule abholen, Hausaufgaben, Spielen und Snack. Montag bis Freitag.	monthly	250	tempelhof-schoeneberg	52.46627413315951	13.37294443288275	ACTIVE	{https://images.unsplash.com/photo-1533483595632-c5f0e57a1936?w=600&h=400&fit=crop&q=80}	{Hausaufgaben,Nachmittag,Schule}	0	0	0	2026-02-25 14:34:59.603	2026-02-25 17:12:34.671
cmm24yvmj0049epd2sg6f368c	cmm24yvlz003oepd2i52hdihx	cmlzh9dj50009s2k6u9vced7v	Aufgaben am Computer – Hilfe für Senioren	E-Mails schreiben, Video-Telefon einrichten, Online-Banking – ich erkläre alles geduldig.	hourly	15	tempelhof-schoeneberg	52.47023707325937	13.38557847537442	ACTIVE	{https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop&q=80}	{Computer,Senioren,Erklärung}	0	0	0	2026-02-25 14:34:59.612	2026-02-25 17:12:34.682
cmm24yvmt004fepd21cn9mh0n	cmm24yvmm004aepd2as0ux32h	cmlzh9dig0001s2k65rzvx31u	Wäsche waschen & bügeln	Du hast keine Zeit zum Waschen und Bügeln? Ich übernehme das gerne. Abholung und Lieferung möglich.	hourly	12	neukoelln	52.47538293818199	13.43330230191904	ACTIVE	{https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&h=400&fit=crop&q=80}	{Wäsche,Bügeln,Haushalt}	0	0	0	2026-02-25 14:34:59.621	2026-02-25 17:12:34.687
cmm24yvn2004pepd28775vorm	cmm24yvmm004aepd2as0ux32h	cmlzh9dix0006s2k6yipho9iy	Bewässerungssystem installieren	Automatische Bewässerung für Garten und Balkon. Tröpfchensysteme und Zeitschaltuhren.	negotiable	\N	neukoelln	52.47349943056025	13.42682598604834	ACTIVE	{https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&q=80}	{Bewässerung,Installation,Automatisch}	0	0	0	2026-02-25 14:34:59.631	2026-02-25 17:12:34.699
cmm24yvne004zepd210gu0081	cmm24yvnb004wepd2u89ec72a	cmlzh9di80000s2k6z65qn0hd	Fenster & Türen abdichten	Zugluft und Wärmeverlust durch undichte Fenster und Türen vermeiden. Ich dichte alles fachgerecht ab.	fixed	50	treptow-koepenick	52.45992192156277	13.56843415579754	ACTIVE	{https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=400&fit=crop&q=80}	{Fenster,Dichten,Energiesparen}	0	0	0	2026-02-25 14:34:59.643	2026-02-25 17:12:34.709
cmm24yvnr0059epd2p28k9a8t	cmm24yvnb004wepd2u89ec72a	cmlzh9diu0005s2k6ujqacuqx	Möbel lagern & einlagern	Du brauchst temporären Stauraum? Ich biete Einlagerung von Möbeln und Kartons für kurze Zeit.	monthly	60	treptow-koepenick	52.4490494013588	13.56554163139346	ACTIVE	{https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop&q=80}	{Lager,Einlagern,Möbel}	0	0	0	2026-02-25 14:34:59.655	2026-02-25 17:12:34.72
cmm24yvo0005hepd24w3d4wt5	cmm24yvnb004wepd2u89ec72a	cmlzh9dj50009s2k6u9vced7v	Schlange stehen & Termine wahrnehmen	Keine Zeit für Behörden, Arzt oder lange Warteschlangen? Ich erledige das für dich.	hourly	12	treptow-koepenick	52.45923316553001	13.56990525466754	ACTIVE	{https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&q=80}	{Warten,Termine,Behörden}	0	0	0	2026-02-25 14:34:59.664	2026-02-25 17:12:34.731
cmm24yvo7005lepd2i28i7ma2	cmm24yvo3005iepd2azi8a828	cmlzh9di80000s2k6z65qn0hd	Rolladen & Jalousien reparieren	Kaputte Rolladen, klemmenede Jalousien – ich repariere und tausche aus. Alle Typen.	fixed	55	marzahn-hellersdorf	52.54670462578663	13.60318834960413	ACTIVE	{https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop&q=80}	{Rolladen,Jalousie,Reparatur}	0	0	0	2026-02-25 14:34:59.671	2026-02-25 17:12:34.733
cmm24yvoi005vepd26uiu3s94	cmm24yvo3005iepd2azi8a828	cmlzh9diu0005s2k6ujqacuqx	Umzug im Haus (Etagen)	Möbel innerhalb eines Gebäudes von Etage zu Etage tragen. Auch ohne Aufzug schnell erledigt.	hourly	20	marzahn-hellersdorf	52.53940484088036	13.59705214592675	ACTIVE	{https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop&q=80}	{Etagen,intern,Möbel}	0	0	0	2026-02-25 14:34:59.682	2026-02-25 17:12:34.745
cmm24yvox0067epd2ec360prb	cmm24yvou0064epd2l6lwjwpu	cmlzh9di80000s2k6z65qn0hd	Türschloss reparieren & öffnen	Ich öffne Türen bei Schlüsselverlust und tausche Schlösser aus. Schnell und diskret. Auch abends erreichbar.	fixed	60	lichtenberg	52.51647747150314	13.49986121286494	ACTIVE	{https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80}	{Schlüsseldienst,Schloss,Notfall}	0	0	0	2026-02-25 14:34:59.698	2026-02-25 17:12:34.756
cmm24yvp9006hepd26fp6zn8w	cmm24yvou0064epd2l6lwjwpu	cmlzh9diu0005s2k6ujqacuqx	Umzugshelfer mit LKW	Ich helfe beim Umzug mit einem 7,5t-LKW. Auch Möbeltransporte innerhalb Berlins. Inkl. Be- und Entladen.	hourly	45	lichtenberg	52.51569784506059	13.49590906073569	ACTIVE	{https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&q=80}	{Umzug,LKW,Transport}	0	0	0	2026-02-25 14:34:59.71	2026-02-25 17:12:34.768
cmm24yvph006pepd2v6i8y8rq	cmm24yvou0064epd2l6lwjwpu	cmlzh9dj50009s2k6u9vced7v	Einkaufen & Erledigungen für Senioren	Ich erledige Einkäufe, Behördengänge und Arztbesuche für ältere Menschen. Geduldig und zuverlässig.	hourly	12	lichtenberg	52.5206188521326	13.48624130588484	ACTIVE	{https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop&q=80}	{Senioren,Einkauf,Hilfe}	0	0	0	2026-02-25 14:34:59.717	2026-02-25 17:12:34.777
cmm24yvpq006vepd2i3i34ttf	cmm24yvpk006qepd2e146gx9y	cmlzh9dig0001s2k65rzvx31u	Fenster putzen innen & außen	Saubere Fenster für mehr Licht. Ich putze Fenster in Wohnungen und Büros. Auch Hochparterre.	fixed	35	reinickendorf	52.58452792361869	13.32785507342692	ACTIVE	{https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80}	{Fenster,Reinigung,Glanz}	0	0	0	2026-02-25 14:34:59.727	2026-02-25 17:12:34.781
cmm24yvpz0075epd2hk1gcdo6	cmm24yvpk006qepd2e146gx9y	cmlzh9dix0006s2k6yipho9iy	Heckenschnitt professionell	Ich schneide Hecken, Sträucher und Büsche in Form. Ordentlich und sauber. Schnittgut wird entsorgt.	fixed	50	reinickendorf	52.56747381877524	13.34031494584987	ACTIVE	{https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600&h=400&fit=crop&q=80}	{Hecke,Schnitt,Garten}	0	0	0	2026-02-25 14:34:59.736	2026-02-25 17:12:34.792
cmm24yvqh007hepd2kj3a86ik	cmm24yvq8007cepd25s01qu5w	cmlzh9dig0001s2k65rzvx31u	Umzugsreinigung mit Übergabegarantie	Professionelle End- und Einzugsreinigung für Mietkautionsrückgabe. Mit Endreinigungsgarantie.	negotiable	\N	mitte	52.52906860657504	13.40994636140665	ACTIVE	{https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&h=400&fit=crop&q=80}	{Umzug,Endreinigung,Kaution}	0	0	0	2026-02-25 14:34:59.753	2026-02-25 17:12:34.804
cmm24yvqs007repd2ptt6l4qg	cmm24yvq8007cepd25s01qu5w	cmlzh9dix0006s2k6yipho9iy	Gartenbeet anlegen & bepflanzen	Ich lege Beete an, bereite den Boden vor und bepflanze nach deinen Wünschen. Gemüse oder Blumen.	hourly	20	mitte	52.52040850069216	13.40441885624905	ACTIVE	{https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&q=80}	{Beet,Pflanzen,Garten}	0	0	0	2026-02-25 14:34:59.764	2026-02-25 17:12:34.814
cmm24yvqx007xepd237tobgi9	cmm24yvq8007cepd25s01qu5w	cmlzh9dj50009s2k6u9vced7v	Übersetzungen DE / EN / TR	Übersetzungen von Dokumenten, Briefen und Formularen. Deutsch, Englisch und Türkisch.	fixed	30	mitte	52.51953080428812	13.41334092289163	ACTIVE	{https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&q=80}	{Übersetzen,Dokumente,Mehrsprachig}	0	0	0	2026-02-25 14:34:59.77	2026-02-25 17:12:34.821
cmm24yvr90087epd2raxa708t	cmm24yvr0007yepd2jcc20vm6	cmlzh9dio0003s2k6c70cmthm	Abiturvorbereitung – alle Fächer	Intensivkurse zur Abiturvorbereitung in Mathe, Physik, Chemie und Deutsch. Kleine Gruppen möglich.	hourly	28	friedrichshain-kreuzberg	52.49679892280351	13.4641749743836	ACTIVE	{https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&q=80}	{Abitur,Nachhilfe,Prüfung}	0	0	0	2026-02-25 14:34:59.782	2026-02-25 17:12:34.829
cmm24yvrk008hepd26ugjgrig	cmm24yvr0007yepd2jcc20vm6	cmlzh9dj20008s2k6kw44rdx0	Make-up für Hochzeiten & Events	Professionelles Make-up für deinen besonderen Tag. Brautmake-up, Abendmake-up, langhaltend.	fixed	70	friedrichshain-kreuzberg	52.49340225951704	13.45623424083478	ACTIVE	{https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=400&fit=crop&q=80}	{Make-up,Hochzeit,Event}	0	0	0	2026-02-25 14:34:59.792	2026-02-25 17:12:34.843
cmm24yvry008tepd2nfe57wv4	cmm24yvro008kepd2podd8g66	cmlzh9dio0003s2k6c70cmthm	Gitarrenunterricht für Anfänger	Ich bringe dir Gitarre bei – von den ersten Akkorden bis zu deinen Lieblingssongs. Alle Altersstufen.	hourly	20	pankow	52.56225170928379	13.40031049770544	ACTIVE	{https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&q=80}	{Gitarre,Musik,Unterricht}	0	0	0	2026-02-25 14:34:59.806	2026-02-25 17:12:34.855
cmm24yvs70093epd292ehwvbw	cmm24yvro008kepd2podd8g66	cmlzh9dj20008s2k6kw44rdx0	Augenbrauen formen & färben	Augenbrauen zupfen, waxen, fadentechnisch formen und bei Bedarf färben. Schnell und präzise.	fixed	20	pankow	52.56199574436659	13.41005900835186	ACTIVE	{https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop&q=80}	{Augenbrauen,Formen,Beauty}	0	0	0	2026-02-25 14:34:59.815	2026-02-25 17:12:34.866
cmm24yvsa0095epd2k61u65l4	cmm24yvro008kepd2podd8g66	cmlzh9dj50009s2k6u9vced7v	Buchhaltung & Steuererklärung	Ich helfe bei der jährlichen Steuererklärung und einfacher Buchführung für Selbstständige.	hourly	35	pankow	52.56982645750649	13.39500484609722	ACTIVE	{https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&h=400&fit=crop&q=80}	{Steuern,Buchhaltung,Finanzen}	0	0	0	2026-02-25 14:34:59.818	2026-02-25 17:12:34.87
cmm24yvsv009hepd2u4e9pa9d	cmm24yvsd0096epd2gaa3evbh	cmlzh9dir0004s2k6juws5z3c	Babysitten für Säuglinge (0–12 Monate)	Spezialisiert auf Säuglingspflege. Ich betreue Babys liebevoll und erfahren. Auch Nachts.	hourly	14	charlottenburg-wilmersdorf	52.51129558789027	13.30473787520361	ACTIVE	{https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=400&fit=crop&q=80}	{Säugling,Baby,Nacht}	0	0	0	2026-02-25 14:34:59.839	2026-02-25 17:12:34.881
cmm24yvt5009repd26e1gu3cu	cmm24yvsd0096epd2gaa3evbh	cmlzh9dj50009s2k6u9vced7v	Fotoshooting für Bewerbung & LinkedIn	Professionelle Bewerbungsfotos und LinkedIn-Portraits. Studio oder outdoor. Schnelle Lieferung.	fixed	60	charlottenburg-wilmersdorf	52.50259248594975	13.29749232011108	ACTIVE	{https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop&q=80}	{Foto,Bewerbung,Portrait}	0	0	0	2026-02-25 14:34:59.85	2026-02-25 17:12:34.892
cmm24yvtk00a3epd2y89uws2c	cmm24yvt8009sepd21mmukuss	cmlzh9dir0004s2k6juws5z3c	Kinder abholen & Hausaufgaben betreuen	Nachmittagsbetreuung: Schule abholen, Hausaufgaben, Spielen und Snack. Montag bis Freitag.	monthly	250	spandau	52.5384964379909	13.19861290526746	ACTIVE	{https://images.unsplash.com/photo-1533483595632-c5f0e57a1936?w=600&h=400&fit=crop&q=80}	{Hausaufgaben,Nachmittag,Schule}	0	0	0	2026-02-25 14:34:59.864	2026-02-25 17:12:34.904
cmm24yvts00abepd2ts8hmyq5	cmm24yvt8009sepd21mmukuss	cmlzh9dj20008s2k6kw44rdx0	Massage – Rücken & Ganzkörper	Entspannungsmassage für zuhause. Rücken-, Nacken- und Ganzkörpermassage. Mit eigenem Öl.	hourly	40	spandau	52.53809456950499	13.1951795113475	ACTIVE	{https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop&q=80}	{Massage,Entspannung,Wellness}	0	0	0	2026-02-25 14:34:59.873	2026-02-25 17:12:34.913
cmm24yvtu00adepd2ghriqzi2	cmm24yvt8009sepd21mmukuss	cmlzh9dj50009s2k6u9vced7v	Aufgaben am Computer – Hilfe für Senioren	E-Mails schreiben, Video-Telefon einrichten, Online-Banking – ich erkläre alles geduldig.	hourly	15	spandau	52.54382777492317	13.20593484996411	ACTIVE	{https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop&q=80}	{Computer,Senioren,Erklärung}	0	0	0	2026-02-25 14:34:59.875	2026-02-25 17:12:34.916
cmm24yvu900apepd2cvehwfko	cmm24yvtx00aeepd27myr702n	cmlzh9dir0004s2k6juws5z3c	Geburtstagsfeiern für Kinder organisieren	Ich organisiere und begleite Kindergeburtstage. Spiele, Bastelideen und viel Spaß für die Kleinen.	fixed	80	steglitz-zehlendorf	52.424428772591	13.24002224527853	ACTIVE	{https://images.unsplash.com/photo-1543342384-1f1350e27861?w=600&h=400&fit=crop&q=80}	{Geburtstag,Party,Kinder}	0	0	0	2026-02-25 14:34:59.889	2026-02-25 17:12:34.929
cmm24yvuk00azepd2tpo1jlj5	cmm24yvtx00aeepd27myr702n	cmlzh9dj50009s2k6u9vced7v	Party & Event dekorieren	Ich dekoriere Geburtstage, Hochzeiten und Feiern. Luftballons, Tische, Beleuchtung – alles dabei.	negotiable	\N	steglitz-zehlendorf	52.43604225395158	13.25841501647964	ACTIVE	{https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&q=80}	{Deko,Party,Event}	0	0	0	2026-02-25 14:34:59.9	2026-02-25 17:12:34.939
cmm24yvv200bbepd26qa6i237	cmm24yvuo00b0epd23vthjfsx	cmlzh9dir0004s2k6juws5z3c	Wochenend-Babysitting	Ihr habt Pläne am Wochenende? Ich passe auf eure Kinder auf. Mit Erfahrung und viel Geduld.	hourly	13	tempelhof-schoeneberg	52.47025344984636	13.39071723263701	ACTIVE	{https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop&q=80}	{Wochenende,Babysitting,Eltern}	0	0	0	2026-02-25 14:34:59.918	2026-02-25 17:12:34.95
cmm24yvv900bjepd2mxgpmiyj	cmm24yvuo00b0epd23vthjfsx	cmlzh9dj20008s2k6kw44rdx0	Kosmetik & Gesichtsbehandlung	Reinigung, Peeling, Maske und Pflege für dein Gesicht. Entspannt und verwöhnt in einer Stunde.	fixed	50	tempelhof-schoeneberg	52.46625491889907	13.38486681268378	ACTIVE	{https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=400&fit=crop&q=80}	{Kosmetik,Gesicht,Peeling}	0	0	0	2026-02-25 14:34:59.926	2026-02-25 17:12:34.961
cmm24yvvo00bvepd20j34sd6z	cmm24yvvf00bmepd2hwfphp4y	cmlzh9dio0003s2k6c70cmthm	BWL & VWL für Studenten	Nachhilfe in Betriebswirtschaft und Volkswirtschaft. Klausurvorbereitung und Verständnishilfe.	hourly	25	neukoelln	52.47615735572338	13.4323767133932	ACTIVE	{https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&q=80}	{BWL,Studium,Nachhilfe}	0	0	0	2026-02-25 14:34:59.94	2026-02-25 17:12:34.973
cmm24yvvy00c5epd24diljzbr	cmm24yvvf00bmepd2hwfphp4y	cmlzh9dj20008s2k6kw44rdx0	Brautfrisur & Hochzeit-Styling	Komplettes Hochzeit-Styling: Haare, Make-up, Brautjungfern auf Wunsch. Termin frühzeitig buchen.	negotiable	\N	neukoelln	52.48231084951026	13.44086252056178	ACTIVE	{https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop&q=80}	{Brautfrisur,Hochzeit,Styling}	0	0	0	2026-02-25 14:34:59.95	2026-02-25 17:12:34.984
\.


--
-- Data for Name: login_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.login_events (id, "userId", "createdAt") FROM stdin;
cmm7hb5cc00013dnbd7d9kvi2	cmlzimbrz00001358r8nmtvtg	2026-03-01 08:19:18.346
cmm7jahf300033dnblm6yq03b	cmlzimbrz00001358r8nmtvtg	2026-03-01 09:14:46.576
cmm7jb34i00053dnbkxy1xsr3	cmlzimbrz00001358r8nmtvtg	2026-03-01 09:15:14.706
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.messages (id, "conversationId", "senderId", content, "deletedAt", "createdAt", "deletedFor") FROM stdin;
cmlzpv37m000b1358mkg72srh	cmlzp2vb500061358y2ebjr8e	cmlzp2icc0004135848tsuh53	s.a birader	\N	2026-02-23 21:56:36.213	{}
cmlzrlsbc0005byym7axrlety	cmlzrlgl00000byymkb1ey8wt	cmlzp2icc0004135848tsuh53	format destegi gerekiyor ne kadara yapabilirsin	\N	2026-02-23 22:45:21.433	{}
cmm258hbs000bbv9a31ejxrim	cmm2586xv0006bv9arcmy1odo	cmlzp2icc0004135848tsuh53	hallo ich liebe di	\N	2026-02-25 14:42:27.641	{}
cmm33oqrn000575arqhhf845t	cmm33oegj000075aryvhb9161	cmm24yvju001uepd2rqzak6lb	hallo ich uch buch	\N	2026-02-26 06:46:53.316	{}
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles (id, "userId", bio, "avatarUrl", phone, district, latitude, longitude, address, "isLocationPublic", "averageRating", "reviewCount", "skillTags", "preferredLocale", "createdAt", "updatedAt", banned) FROM stdin;
cmlzimbs000011358ia5iripx	cmlzimbrz00001358r8nmtvtg	\N	\N	\N	treptow-koepenick	\N	\N	\N	t	0	0	{}	de	2026-02-23 18:33:50.111	2026-02-23 18:33:50.111	f
cmlzp2icc00051358e4peb0xm	cmlzp2icc0004135848tsuh53	\N	\N	\N	marzahn-hellersdorf	\N	\N	\N	t	0	0	{}	de	2026-02-23 21:34:22.812	2026-02-23 21:34:22.812	f
cmm220jnb0001quhps7uuhdhz	cmm220jna0000quhp2nvxeuhz	Ich bin eine vielseitige Berlinerin und helfe gerne in der Nachbarschaft.	\N	\N	mitte	\N	\N	\N	t	0	0	{Reinigung,Kochen,Nachhilfe}	de	2026-02-25 13:12:18.551	2026-02-25 13:12:18.551	f
cmm24yvh60001epd2cd6pv3h0	cmm24yvh50000epd25psjcjkt	Ich bin Handwerkerin mit 10 Jahren Erfahrung und helfe gern in der Nachbarschaft.	\N	\N	mitte	52.51308033674453	13.39788662951106	\N	t	0	0	{Handwerk,Renovierung,Malerei}	de	2026-02-25 14:34:59.417	2026-02-25 14:34:59.417	f
cmm24yvj30019epd2b3c31cnx	cmm24yvj30018epd2rxi8qgi4	Lehrerin mit Herz für Kinder. Nachhilfe und Babysitting sind meine Stärken.	\N	\N	pankow	52.56016075448036	13.39980765785756	\N	t	0	0	{Nachhilfe,Babysitting,Englisch}	de	2026-02-25 14:34:59.487	2026-02-25 14:34:59.487	f
cmm24yvju001vepd2cxkj9ctq	cmm24yvju001uepd2rqzak6lb	Gelernter Koch und Foodie. Ich koche für Partys und gebe Kochkurse.	\N	\N	charlottenburg-wilmersdorf	52.51282903460235	13.31189527525784	\N	t	0	0	{Kochen,Catering,Backen}	de	2026-02-25 14:34:59.514	2026-02-25 14:34:59.514	f
cmm24yvkm002hepd2109ouigh	cmm24yvkm002gepd2d3a8fzdx	Professionelle Reinigungskraft mit eigenem Equipment. Sauber und zuverlässig.	\N	\N	spandau	52.52932765722551	13.19999241355551	\N	t	0	0	{Reinigung,Haushaltsorganisation}	de	2026-02-25 14:34:59.543	2026-02-25 14:34:59.543	f
cmm24yvla0033epd2jk2obavh	cmm24yvla0032epd2ov7motu5	Elektriker und Heimwerker. Kleine Reparaturen schnell und günstig erledigt.	\N	\N	steglitz-zehlendorf	52.42604130859108	13.2546988915475	\N	t	0	0	{Elektrik,Heimwerken,Installationen}	de	2026-02-25 14:34:59.567	2026-02-25 14:34:59.567	f
cmm24yvlz003pepd2dqpwocfy	cmm24yvlz003oepd2i52hdihx	Friseurin mit eigenem Salon-Erfahrung. Ich komme auch nach Hause zu dir.	\N	\N	tempelhof-schoeneberg	52.46288900888968	13.38369669725407	\N	t	0	0	{Friseur,Beauty,Styling}	de	2026-02-25 14:34:59.592	2026-02-25 14:34:59.592	f
cmm24yvmm004bepd2m1if7wrb	cmm24yvmm004aepd2as0ux32h	Umzugshelfer mit LKW-Führerschein. Schnell, stark und zuverlässig.	\N	\N	neukoelln	52.48612255134272	13.43261374822576	\N	t	0	0	{Umzüge,Transport,Möbelaufbau}	de	2026-02-25 14:34:59.615	2026-02-25 14:34:59.615	f
cmm24yvnb004xepd2774bee6w	cmm24yvnb004wepd2u89ec72a	Yogalehrerin und Ernährungsberaterin. Gesundheit ist meine Leidenschaft.	\N	\N	treptow-koepenick	52.45191748060915	13.57074688811239	\N	t	0	0	{Yoga,Ernährung,Fitness}	de	2026-02-25 14:34:59.639	2026-02-25 14:34:59.639	f
cmm24yvo3005jepd260y2zo9o	cmm24yvo3005iepd2azi8a828	Grafiker und Webdesigner. Ich erstelle professionelle Designs für kleine Unternehmen.	\N	\N	marzahn-hellersdorf	52.54376277744596	13.60244692904939	\N	t	0	0	{Grafikdesign,Webdesign,Logo}	de	2026-02-25 14:34:59.667	2026-02-25 14:34:59.667	f
cmm24yvou0065epd272oungla	cmm24yvou0064epd2l6lwjwpu	Tierpflegerin mit viel Liebe zu Tieren. Ich passe gern auf Hunde und Katzen auf.	\N	\N	lichtenberg	52.51959676045423	13.50279146002114	\N	t	0	0	{Tierpflege,Hundebetreuung,Tierliebe}	de	2026-02-25 14:34:59.694	2026-02-25 14:34:59.694	f
cmm24yvpk006repd2g4u4jumg	cmm24yvpk006qepd2e146gx9y	Klempner mit Gesellenbrief. Wasserprobleme werden schnell gelöst.	\N	\N	reinickendorf	52.56874518859271	13.33084157209022	\N	t	0	0	{Klempner,Sanitär,Heizung}	de	2026-02-25 14:34:59.72	2026-02-25 14:34:59.72	f
cmm24yvq8007depd2dka00ydh	cmm24yvq8007cepd25s01qu5w	Musikerin und Musiklehrerin. Gitarre, Klavier und Gesang für alle Altersgruppen.	\N	\N	mitte	52.52291461849488	13.41218690870274	\N	t	0	0	{Gitarre,Klavier,Gesangsunterricht}	de	2026-02-25 14:34:59.745	2026-02-25 14:34:59.745	f
cmm24yvr0007zepd2dudun319	cmm24yvr0007yepd2jcc20vm6	Fotograf mit eigenem Studio. Portraits, Events und Produktfotos.	\N	\N	friedrichshain-kreuzberg	52.50510427963292	13.45664012560234	\N	t	0	0	{Fotografie,Portraits,Events}	de	2026-02-25 14:34:59.772	2026-02-25 14:34:59.772	f
cmm24yvro008lepd2ktckezfv	cmm24yvro008kepd2podd8g66	Schneiderin und Näherin. Ich ändere Kleidung und nähe auf Maß.	\N	\N	pankow	52.56706933615968	13.39785398823511	\N	t	0	0	{Schneiderei,Nähen,Änderungen}	de	2026-02-25 14:34:59.797	2026-02-25 14:34:59.797	f
cmm24yvsd0097epd2nxpanmto	cmm24yvsd0096epd2gaa3evbh	Programmierer und App-Entwickler. Websites und Apps zu fairen Preisen.	\N	\N	charlottenburg-wilmersdorf	52.50064009007792	13.29811290197992	\N	t	0	0	{Programmierung,App-Entwicklung,Python}	de	2026-02-25 14:34:59.822	2026-02-25 14:34:59.822	f
cmm24yvt8009tepd2g5h17lrr	cmm24yvt8009sepd21mmukuss	Übersetzerin für Deutsch, Englisch und Französisch. Dokumente und Briefe.	\N	\N	spandau	52.52927340843218	13.19792890967584	\N	t	0	0	{Übersetzen,Englisch,Französisch}	de	2026-02-25 14:34:59.853	2026-02-25 14:34:59.853	f
cmm24yvtx00afepd2yswim03e	cmm24yvtx00aeepd27myr702n	Möbeltischler und Schreiner. Ich baue und repariere Möbel aus Holz.	\N	\N	steglitz-zehlendorf	52.43481930819745	13.25336580948095	\N	t	0	0	{Tischlerei,Holzarbeit,Möbelbau}	de	2026-02-25 14:34:59.877	2026-02-25 14:34:59.877	f
cmm24yvuo00b1epd27jxmjrxl	cmm24yvuo00b0epd23vthjfsx	Buchhalterin und Steuerberaterin. Ich helfe bei Steuererklärungen und Buchhaltung.	\N	\N	tempelhof-schoeneberg	52.46044141599818	13.38499581781055	\N	t	0	0	{Buchhaltung,Steuern,Finanzen}	de	2026-02-25 14:34:59.904	2026-02-25 14:34:59.904	f
cmm24yvvf00bnepd2hnfs43b4	cmm24yvvf00bmepd2hwfphp4y	Fahrradmechaniker und Outdoor-Fan. Fahrradreparatur und -wartung schnell erledigt.	\N	\N	neukoelln	52.47848782319974	13.43137235956077	\N	t	5	1	{Fahrradreparatur,Outdoor,Montage}	de	2026-02-25 14:34:59.931	2026-02-25 14:41:16.186	f
cmm24yvif000nepd2nrnginmi	cmm24yvif000mepd2lqt0u2pj	IT-Spezialist und Hobbygärtner. Ich helfe bei Tech-Problemen und Gartenpflege.	\N	\N	friedrichshain-kreuzberg	52.50427080559855	13.45930570000269	\N	t	5	1	{IT-Support,Gartenpflege,Linux}	de	2026-02-25 14:34:59.463	2026-02-25 14:42:10.779	f
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reports (id, "reporterId", "reportedId", reason, details, status, "createdAt", "updatedAt", "listingId") FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, "listingId", "authorId", "targetId", rating, comment, status, "createdAt", "updatedAt") FROM stdin;
cmm256y6e0002bv9aoalzui55	\N	cmlzp2icc0004135848tsuh53	cmm24yvvf00bmepd2hwfphp4y	5	super ha	APPROVED	2026-02-25 14:41:16.166	2026-02-25 14:41:16.166
cmm2584b00005bv9a1wgi16ib	cmm24yviv0011epd28t85ttbw	cmlzp2icc0004135848tsuh53	cmm24yvif000mepd2lqt0u2pj	5	hallo	APPROVED	2026-02-25 14:42:10.764	2026-02-25 14:42:10.764
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, "emailVerified", "passwordHash", name, image, role, "createdAt", "updatedAt") FROM stdin;
cmlzp2icc0004135848tsuh53	amustafayilmaz2@gmail.com	\N	$2b$12$4Y5xenHho09sIVUSL8MNMewQIg34cAVk1yI.E2.OxfnvJHOS5ayYC	fevzi	\N	USER	2026-02-23 21:34:22.812	2026-02-23 21:34:22.812
cmm220jna0000quhp2nvxeuhz	test@kiezhelfer.de	\N	$2b$10$4REuw.7fLSuEHfmltluOx.0DgeQOj/k4KXy8G/q/wFJo9Dmhpj/rW	Lisa Muller	\N	USER	2026-02-25 13:12:18.551	2026-02-25 13:12:18.551
cmm24yvh50000epd25psjcjkt	anna.bauer@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Anna Bauer	\N	USER	2026-02-25 14:34:59.417	2026-02-25 14:34:59.417
cmm24yvif000mepd2lqt0u2pj	max.schneider@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Max Schneider	\N	USER	2026-02-25 14:34:59.463	2026-02-25 14:34:59.463
cmm24yvj30018epd2rxi8qgi4	laura.hoffmann@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Laura Hoffmann	\N	USER	2026-02-25 14:34:59.487	2026-02-25 14:34:59.487
cmm24yvju001uepd2rqzak6lb	felix.wagner@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Felix Wagner	\N	USER	2026-02-25 14:34:59.514	2026-02-25 14:34:59.514
cmm24yvkm002gepd2d3a8fzdx	sophie.mueller@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Sophie Müller	\N	USER	2026-02-25 14:34:59.543	2026-02-25 14:34:59.543
cmm24yvla0032epd2ov7motu5	jonas.klein@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Jonas Klein	\N	USER	2026-02-25 14:34:59.567	2026-02-25 14:34:59.567
cmm24yvlz003oepd2i52hdihx	maria.schmidt@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Maria Schmidt	\N	USER	2026-02-25 14:34:59.592	2026-02-25 14:34:59.592
cmm24yvmm004aepd2as0ux32h	paul.richter@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Paul Richter	\N	USER	2026-02-25 14:34:59.615	2026-02-25 14:34:59.615
cmm24yvnb004wepd2u89ec72a	emma.fischer@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Emma Fischer	\N	USER	2026-02-25 14:34:59.639	2026-02-25 14:34:59.639
cmm24yvo3005iepd2azi8a828	leon.weber@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Leon Weber	\N	USER	2026-02-25 14:34:59.667	2026-02-25 14:34:59.667
cmm24yvou0064epd2l6lwjwpu	mia.braun@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Mia Braun	\N	USER	2026-02-25 14:34:59.694	2026-02-25 14:34:59.694
cmm24yvpk006qepd2e146gx9y	noah.zimmermann@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Noah Zimmermann	\N	USER	2026-02-25 14:34:59.72	2026-02-25 14:34:59.72
cmm24yvq8007cepd25s01qu5w	lena.krause@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Lena Krause	\N	USER	2026-02-25 14:34:59.745	2026-02-25 14:34:59.745
cmm24yvr0007yepd2jcc20vm6	tim.schulz@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Tim Schulz	\N	USER	2026-02-25 14:34:59.772	2026-02-25 14:34:59.772
cmm24yvro008kepd2podd8g66	sara.koenig@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Sara König	\N	USER	2026-02-25 14:34:59.797	2026-02-25 14:34:59.797
cmm24yvsd0096epd2gaa3evbh	finn.meyer@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Finn Meyer	\N	USER	2026-02-25 14:34:59.822	2026-02-25 14:34:59.822
cmm24yvt8009sepd21mmukuss	clara.wolf@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Clara Wolf	\N	USER	2026-02-25 14:34:59.853	2026-02-25 14:34:59.853
cmm24yvtx00aeepd27myr702n	ben.lange@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Ben Lange	\N	USER	2026-02-25 14:34:59.877	2026-02-25 14:34:59.877
cmm24yvuo00b0epd23vthjfsx	hanna.schwarz@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Hanna Schwarz	\N	USER	2026-02-25 14:34:59.904	2026-02-25 14:34:59.904
cmm24yvvf00bmepd2hwfphp4y	lukas.becker@example.de	\N	$2b$10$J3XrpysMv0PZxQX5s3QMzOpA5jc/Yb70wumzW3doWkVAEz0tk/sTe	Lukas Becker	\N	USER	2026-02-25 14:34:59.931	2026-02-25 14:34:59.931
cmlzimbrz00001358r8nmtvtg	amustafaylmz@gmail.com	\N	$2b$10$Pwiku40jknB8uciyxrZUcOrGkqJmoBxAGQ70CrQb7RbQNlcxH2GHa	mustafa	\N	ADMIN	2026-02-23 18:33:50.111	2026-02-23 18:33:50.111
\.


--
-- Data for Name: verification_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.verification_tokens (identifier, token, expires) FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: conversation_participants conversation_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT conversation_participants_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: login_events login_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_events
    ADD CONSTRAINT login_events_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accounts_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON public.accounts USING btree (provider, "providerAccountId");


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: conversation_participants_conversationId_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "conversation_participants_conversationId_userId_key" ON public.conversation_participants USING btree ("conversationId", "userId");


--
-- Name: conversation_participants_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "conversation_participants_userId_idx" ON public.conversation_participants USING btree ("userId");


--
-- Name: conversations_listingId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "conversations_listingId_idx" ON public.conversations USING btree ("listingId");


--
-- Name: listings_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "listings_categoryId_idx" ON public.listings USING btree ("categoryId");


--
-- Name: listings_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "listings_createdAt_idx" ON public.listings USING btree ("createdAt" DESC);


--
-- Name: listings_district_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX listings_district_idx ON public.listings USING btree (district);


--
-- Name: listings_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX listings_status_idx ON public.listings USING btree (status);


--
-- Name: listings_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "listings_userId_idx" ON public.listings USING btree ("userId");


--
-- Name: login_events_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "login_events_createdAt_idx" ON public.login_events USING btree ("createdAt");


--
-- Name: login_events_userId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "login_events_userId_createdAt_idx" ON public.login_events USING btree ("userId", "createdAt");


--
-- Name: messages_conversationId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "messages_conversationId_createdAt_idx" ON public.messages USING btree ("conversationId", "createdAt");


--
-- Name: messages_senderId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "messages_senderId_idx" ON public.messages USING btree ("senderId");


--
-- Name: profiles_district_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX profiles_district_idx ON public.profiles USING btree (district);


--
-- Name: profiles_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "profiles_userId_key" ON public.profiles USING btree ("userId");


--
-- Name: reports_listingId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "reports_listingId_idx" ON public.reports USING btree ("listingId");


--
-- Name: reports_reportedId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "reports_reportedId_idx" ON public.reports USING btree ("reportedId");


--
-- Name: reports_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reports_status_idx ON public.reports USING btree (status);


--
-- Name: reviews_listingId_authorId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "reviews_listingId_authorId_key" ON public.reviews USING btree ("listingId", "authorId");


--
-- Name: reviews_listingId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "reviews_listingId_idx" ON public.reviews USING btree ("listingId");


--
-- Name: reviews_targetId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "reviews_targetId_idx" ON public.reviews USING btree ("targetId");


--
-- Name: sessions_sessionToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "sessions_sessionToken_key" ON public.sessions USING btree ("sessionToken");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: verification_tokens_identifier_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX verification_tokens_identifier_token_key ON public.verification_tokens USING btree (identifier, token);


--
-- Name: verification_tokens_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX verification_tokens_token_key ON public.verification_tokens USING btree (token);


--
-- Name: accounts accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: conversation_participants conversation_participants_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT "conversation_participants_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public.conversations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: conversation_participants conversation_participants_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_participants
    ADD CONSTRAINT "conversation_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: listings listings_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings


--
-- Name: listings listings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT "listings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: login_events login_events_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_events
    ADD CONSTRAINT "login_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public.conversations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: profiles profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reports reports_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "reports_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reports reports_reportedId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "reports_reportedId_fkey" FOREIGN KEY ("reportedId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reports reports_reporterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public.listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_targetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


