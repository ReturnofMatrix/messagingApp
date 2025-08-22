--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: roshanbhogan
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    text text NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    created_by integer NOT NULL,
    post_id integer NOT NULL
);


ALTER TABLE public."Comment" OWNER TO roshanbhogan;

--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: roshanbhogan
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Comment_id_seq" OWNER TO roshanbhogan;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: roshanbhogan
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: Friends; Type: TABLE; Schema: public; Owner: roshanbhogan
--

CREATE TABLE public."Friends" (
    id integer NOT NULL,
    request_to integer NOT NULL,
    request_by integer NOT NULL,
    pending boolean DEFAULT true NOT NULL,
    accepted boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Friends" OWNER TO roshanbhogan;

--
-- Name: Friends_id_seq; Type: SEQUENCE; Schema: public; Owner: roshanbhogan
--

CREATE SEQUENCE public."Friends_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Friends_id_seq" OWNER TO roshanbhogan;

--
-- Name: Friends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: roshanbhogan
--

ALTER SEQUENCE public."Friends_id_seq" OWNED BY public."Friends".id;


--
-- Name: Likes; Type: TABLE; Schema: public; Owner: roshanbhogan
--

CREATE TABLE public."Likes" (
    id integer NOT NULL,
    liked_at timestamp(3) without time zone NOT NULL,
    liked_by integer NOT NULL,
    post_id integer NOT NULL
);


ALTER TABLE public."Likes" OWNER TO roshanbhogan;

--
-- Name: Likes_id_seq; Type: SEQUENCE; Schema: public; Owner: roshanbhogan
--

CREATE SEQUENCE public."Likes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Likes_id_seq" OWNER TO roshanbhogan;

--
-- Name: Likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: roshanbhogan
--

ALTER SEQUENCE public."Likes_id_seq" OWNED BY public."Likes".id;


--
-- Name: Messages; Type: TABLE; Schema: public; Owner: roshanbhogan
--

CREATE TABLE public."Messages" (
    id integer NOT NULL,
    senderid integer NOT NULL,
    receiverid integer NOT NULL,
    text text NOT NULL,
    "time" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Messages" OWNER TO roshanbhogan;

--
-- Name: Messages_id_seq; Type: SEQUENCE; Schema: public; Owner: roshanbhogan
--

CREATE SEQUENCE public."Messages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Messages_id_seq" OWNER TO roshanbhogan;

--
-- Name: Messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: roshanbhogan
--

ALTER SEQUENCE public."Messages_id_seq" OWNED BY public."Messages".id;


--
-- Name: Post; Type: TABLE; Schema: public; Owner: roshanbhogan
--

CREATE TABLE public."Post" (
    id integer NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    author_id integer NOT NULL,
    caption text,
    photo text
);


ALTER TABLE public."Post" OWNER TO roshanbhogan;

--
-- Name: Post_id_seq; Type: SEQUENCE; Schema: public; Owner: roshanbhogan
--

CREATE SEQUENCE public."Post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Post_id_seq" OWNER TO roshanbhogan;

--
-- Name: Post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: roshanbhogan
--

ALTER SEQUENCE public."Post_id_seq" OWNED BY public."Post".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: roshanbhogan
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    hashedpass text NOT NULL,
    bio text NOT NULL,
    birthday text NOT NULL,
    hobbies text NOT NULL,
    "profilePic" text,
    gender text NOT NULL
);


ALTER TABLE public."User" OWNER TO roshanbhogan;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: roshanbhogan
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO roshanbhogan;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: roshanbhogan
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: roshanbhogan
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


ALTER TABLE public._prisma_migrations OWNER TO roshanbhogan;

--
-- Name: session; Type: TABLE; Schema: public; Owner: roshanbhogan
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO roshanbhogan;

--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: Friends id; Type: DEFAULT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Friends" ALTER COLUMN id SET DEFAULT nextval('public."Friends_id_seq"'::regclass);


--
-- Name: Likes id; Type: DEFAULT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Likes" ALTER COLUMN id SET DEFAULT nextval('public."Likes_id_seq"'::regclass);


--
-- Name: Messages id; Type: DEFAULT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Messages" ALTER COLUMN id SET DEFAULT nextval('public."Messages_id_seq"'::regclass);


--
-- Name: Post id; Type: DEFAULT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Post" ALTER COLUMN id SET DEFAULT nextval('public."Post_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: roshanbhogan
--

COPY public."Comment" (id, text, created_at, created_by, post_id) FROM stdin;
1	hello christiana how are you long time no see.	2025-08-07 13:29:02.113	10	10
2	ohh delicious.	2025-08-08 07:39:24.976	11	11
10	a	2025-08-08 08:16:26.845	11	11
20	wrfdassda	2025-08-11 15:18:32.42	2	11
21	sadfasd	2025-08-11 15:18:37.606	2	11
22	sadf	2025-08-11 15:29:33.036	2	11
24	hello my all my friends how are you all ?	2025-08-16 06:42:46.966	15	25
25	hello friend accept it all with relaxation and joy.	2025-08-18 07:21:30.821	2	1
26	i am good and i am proud of you .	2025-08-22 06:07:33.39	2	44
\.


--
-- Data for Name: Friends; Type: TABLE DATA; Schema: public; Owner: roshanbhogan
--

COPY public."Friends" (id, request_to, request_by, pending, accepted) FROM stdin;
2	8	10	t	f
3	6	8	t	f
4	5	3	t	f
5	9	6	t	f
1	3	8	f	t
7	3	2	f	t
10	4	3	t	f
13	3	7	t	f
14	9	7	t	f
15	10	7	f	t
6	11	2	f	t
8	11	3	t	f
11	11	7	t	f
16	10	11	t	f
17	9	11	t	f
18	8	11	t	f
20	3	11	t	f
21	5	11	t	f
25	4	2	t	f
26	6	2	t	f
28	1	2	f	t
29	2	1	f	t
30	5	2	t	f
12	2	7	f	t
9	2	3	f	t
19	2	11	f	t
31	7	2	t	f
\.


--
-- Data for Name: Likes; Type: TABLE DATA; Schema: public; Owner: roshanbhogan
--

COPY public."Likes" (id, liked_at, liked_by, post_id) FROM stdin;
5	2025-08-08 08:17:21.75	11	11
26	2025-08-16 06:41:17.322	15	25
31	2025-08-18 08:50:24.641	2	37
32	2025-08-18 08:50:33.368	2	40
33	2025-08-18 08:53:42.235	2	38
34	2025-08-22 06:07:03.137	2	44
\.


--
-- Data for Name: Messages; Type: TABLE DATA; Schema: public; Owner: roshanbhogan
--

COPY public."Messages" (id, senderid, receiverid, text, "time") FROM stdin;
1	7	9	Quaerat demonstro cuius ventosus ea ago catena tactus cogito.	2025-08-06 15:16:31.642
2	10	6	Defaeco comparo incidunt angulus bibo demens vinitor terreo depopulo certus.	2025-08-06 20:29:26.951
3	4	9	Cernuus cresco dolorum arbitro colo thymbra.	2025-08-06 13:22:06.323
4	2	4	Advoco thymum viridis tabesco repellat creo quaerat aiunt.	2025-08-06 21:30:03.613
6	5	2	Defungo adhuc volaticus vomica suppellex curvo confido ait.	2025-08-06 22:27:53.932
7	7	8	Aggero conservo aureus argentum pecco tabgo.	2025-08-06 19:03:52.906
8	7	3	Tam benevolentia usus admiratio trado speciosus provident.	2025-08-07 03:39:04.063
9	5	9	Supra advoco nisi sto synagoga eligendi defetiscor ulciscor.	2025-08-06 11:37:42.547
11	8	4	Canis tenax blandior cui callide tamen.	2025-08-06 17:22:33.615
12	7	3	Curvo adicio cetera.	2025-08-07 02:30:46.128
13	6	9	Amplexus termes aspicio vaco.	2025-08-07 01:30:25.767
14	10	7	Circumvenio similique vel pectus dens cogo cavus vomer cattus voveo.	2025-08-06 11:12:53.04
15	8	10	Stabilis solutio arto veritatis aestas voluntarius vel accusamus.	2025-08-06 20:09:35.216
10	11	5	Inflammatio valeo decor deputo deprecator astrum deinde ultio villa aperte.	2025-08-06 09:39:43.82
5	5	11	Absum amitto caelestis strues.	2025-08-07 02:16:34.458
16	2	1	Hello Guest 😊	2025-08-11 14:10:19.002
17	2	1	How are you ?	2025-08-11 14:10:28.593
18	2	1	Long time no see.	2025-08-11 14:10:39.662
19	2	3	sdfsadf	2025-08-12 06:48:28.236
20	2	3	asdf	2025-08-12 06:48:31.3
21	2	3	h	2025-08-12 07:28:54.91
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: roshanbhogan
--

COPY public."Post" (id, created_at, author_id, caption, photo) FROM stdin;
3	2025-08-06 15:45:37.941	3	Spiculum cometes triumphus conculco circumvenio casso civis corrumpo vitae.	https://picsum.photos/seed/1jXAhWU/2913/2146?grayscale&blur=2
4	2025-08-06 21:07:53.785	4	Bonus ancilla denuncio accusator arma tandem tunc cogo sumo.	https://picsum.photos/seed/wkh8l9L/911/3017?grayscale&blur=4
5	2025-08-07 05:03:47.795	5	Degenero argumentum tonsor taceo corpus cenaculum uxor color ustilo dignissimos.	https://picsum.photos/seed/D9kAssypHN/320/874?grayscale&blur=8
6	2025-08-07 02:39:24.82	6	Vir aegrotatio usque coaegresco laborum copiose utrimque adulatio spiculum ustulo.	https://picsum.photos/seed/3BS5kgY/3537/2834?blur=7
7	2025-08-06 14:49:11.603	7	Occaecati abduco amicitia utrum xiphias.	https://picsum.photos/seed/d1BgZT/1330/2252?blur=5
8	2025-08-06 18:36:55.453	8	Thymbra compono adhaero numquam audentia sit quae suggero cognomen tempus.	https://picsum.photos/seed/0bdqatp8/2967/810
9	2025-08-06 23:01:29.434	9	Antiquus arx carcer quas.	https://picsum.photos/seed/VjsXh7C29/2433/293?blur=2
10	2025-08-06 20:27:00.262	10	Magnam virgo eaque clibanus stabilis.	https://picsum.photos/seed/k0JLoZg/3326/3096?blur=1
1	2025-08-06 16:45:32.511	11	Talus truculenter vivo spoliatio audacia iusto.	https://picsum.photos/seed/WAVBtZaAGu/2859/130?grayscale&blur=1
11	2025-08-08 07:39:04.459	11	lets make pancakes tonight.	\N
18	2025-08-14 14:21:59.349	13	hhhhh	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755181318/instachat/gi82jwxwomzsgv5e3siq.jpg
19	2025-08-14 14:28:55.651	13		https://res.cloudinary.com/dttkcwuw8/image/upload/v1755181734/instachat/rfwqmvgcd9wlc5piiknr.webp
25	2025-08-16 06:41:09.324	15	all there is for you to make something out of life is now and your purpose.	\N
26	2025-08-16 07:12:54.789	15	\N	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755328373/instachat/trnkakg217kxxbzjgsuw.jpg
27	2025-08-16 08:46:56.396	15	\N	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755334015/instachat/maaxgapv3gotbwsezxrd.jpg
32	2025-08-18 07:49:57.932	2	reddit first	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755503397/instachat/nipi9lmafufyeohs0bbd.jpg
33	2025-08-18 07:50:48.752	2	lets see.	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755503448/instachat/qewub0a2fwk7sq00vt3s.webp
34	2025-08-18 07:51:53.242	2	asdfasd	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755503512/instachat/ryqz1fdstlznkffsve9u.jpg
35	2025-08-18 07:54:57.24	2	khbkbh	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755503696/instachat/gl3cnu1v2krmndt2ch5z.webp
36	2025-08-18 07:55:51.633	2	adsdfsaf	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755503750/instachat/vrveneodfvm0jvfflykf.jpg
37	2025-08-18 07:59:22.003	2	waldo wlaso	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755503961/instachat/brbwiymwynqo2my9sqg1.png
38	2025-08-18 08:02:36.923	2	ihbkhb	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755504156/instachat/rwcpdt4d60jjw4kamuip.jpg
39	2025-08-18 08:10:10.218	2	shalimar restrau...	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755504609/instachat/kvuxgqqtne6j8cdx8cgi.jpg
40	2025-08-18 08:50:28.02	2	\N	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755507027/instachat/gm4ad05xbuwhsq62xho2.jpg
41	2025-08-18 08:53:38.142	2	\N	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755507217/instachat/ilfxc1jkmwnzalzewh73.png
42	2025-08-19 06:50:23.332	2	\N	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755586222/instachat/cgcwmbroqkdj92tlyaes.png
43	2025-08-20 14:05:26.159	2	i am proud of myself.	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755698725/instachat/haqgyrarrok1p2lqioyi.jpg
44	2025-08-22 06:06:57.997	2	hello there how are you all ?	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755842817/instachat/bisfxkctqldphsvlwaz6.png
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: roshanbhogan
--

COPY public."User" (id, email, username, hashedpass, bio, birthday, hobbies, "profilePic", gender) FROM stdin;
3	Alexandrea_Gorczany@hotmail.com	Shaina_Bruen13	$2b$10$bYz2/hDuPYSQ6jzzRKyT/ej5uRgz.A7JEwxb8Ic7zOd0lJmwVGf8a	Vado conscendo ars tenax traho.	1988-08-05T09:47:55.817Z	absentmindedly ouch slink	https://avatars.githubusercontent.com/u/7864916	female
4	Braulio.Sipes@gmail.com	Deshawn_Koelpin	$2b$10$bYz2/hDuPYSQ6jzzRKyT/ej5uRgz.A7JEwxb8Ic7zOd0lJmwVGf8a	Tamisium deleniti terra averto arcesso vulgivagus atque vicissitudo.	2004-06-18T02:24:02.318Z	though annex curly	https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/85.jpg	female
5	Clark45@gmail.com	Laurence.Grimes	$2b$10$bYz2/hDuPYSQ6jzzRKyT/ej5uRgz.A7JEwxb8Ic7zOd0lJmwVGf8a	Ad substantia virga temperantia adficio solitudo.	1995-08-26T22:41:56.099Z	genuine surprisingly boohoo	https://avatars.githubusercontent.com/u/41354294	female
6	Xavier67@yahoo.com	Hillary.Reichel10	$2b$10$bYz2/hDuPYSQ6jzzRKyT/ej5uRgz.A7JEwxb8Ic7zOd0lJmwVGf8a	Tam carbo cribro umbra adflicto voluptatem repellendus.	1981-05-15T00:10:24.075Z	within excluding programme	https://avatars.githubusercontent.com/u/13149921	female
7	Ivory_Howe@hotmail.com	Thora.Wyman35	$2b$10$bYz2/hDuPYSQ6jzzRKyT/ej5uRgz.A7JEwxb8Ic7zOd0lJmwVGf8a	Usque apto defero nam aufero doloribus ager aliquid voco cena.	2002-09-11T22:21:21.586Z	range quick-witted till	https://avatars.githubusercontent.com/u/8955083	female
8	Easter91@gmail.com	Cory_Mann14	$2b$10$bYz2/hDuPYSQ6jzzRKyT/ej5uRgz.A7JEwxb8Ic7zOd0lJmwVGf8a	Cognatus defetiscor ultra sulum cognomen ullam debeo minus.	1993-12-14T08:43:10.761Z	yuck black-and-white quietly	https://avatars.githubusercontent.com/u/86567236	male
9	Bonnie_Predovic88@gmail.com	Kaleigh_Gusikowski	$2b$10$bYz2/hDuPYSQ6jzzRKyT/ej5uRgz.A7JEwxb8Ic7zOd0lJmwVGf8a	Caelestis clamo nisi facere.	1985-09-01T23:31:25.235Z	bonnet wisecrack pish	https://avatars.githubusercontent.com/u/60150592	male
10	Jarvis.Ebert@gmail.com	Christiana_Stanton26	$2b$10$bYz2/hDuPYSQ6jzzRKyT/ej5uRgz.A7JEwxb8Ic7zOd0lJmwVGf8a	Bardus abeo asporto.	1984-12-07T12:38:16.274Z	duh embed boo	https://avatars.githubusercontent.com/u/66296389	female
11	Norwood.Kirlin10@gmail.com	Monte25	$2b$10$bYz2/hDuPYSQ6jzzRKyT/ej5uRgz.A7JEwxb8Ic7zOd0lJmwVGf8a	Cribro coadunatio recusandae vinco voveo ciminatio ustilo timidus.	1999-08-28T13:42:37.439Z	pushy oof starch	https://avatars.githubusercontent.com/u/8894305	male
2	Eliane57@yahoo.com	Lenora24	$2b$10$bYz2/hDuPYSQ6jzzRKyT/ej5uRgz.A7JEwxb8Ic7zOd0lJmwVGf8a	Calamitas decimus amplexus vomica carbo absconditus utor absorbeo recusandae vesco.	2005-09-02	gracefully blacken consequently	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755586887/instachat/rsqbj95t1c1qmbtxmf3f.png	female
1	guest@example.com	guest	$2a$07$ElsDTXwkeupontSJj04m3.iLt6l3gNs4l3csIKfJTziMOXtDGubie	This is a guest user.	1990-01-01	reading, testing, guesting	https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/67.jpg	Other
12	sonali@bhogan	sonali	$2b$09$QmUMPqS12aVPPzz2JO9gg.VrGWfA0/kRhlcrPJFLlxju5eS9eLAfG	architect at mind, human at heart.	2000-03-03	drawing.	/uploads/female_profilePic.jpg	female
14	s	s	$2b$09$Gt.1gmxTBMKRklPbWDgDuOxyqaJl6eO0hHmmVzx4OkpsU.xhvu.ti	s	2025-08-28	s	\N	female
15	q	q	$2b$09$nRsawFKft04bVwZcwcD6le0l2zPWDsYDmQ7VrprEQSHRxNJzbCRfi	q	2001-04-02	q	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755333936/instachat/quxueze9bciixh6qcbdj.webp	female
13	a	a	$2b$09$IyCjHmevXpvykgy/qVZDDeNG1mm7U4D8KVHIciigfj5Q78yg4ormO	running.	20001-04-01	people watching.	https://res.cloudinary.com/dttkcwuw8/image/upload/v1755251119/instachat/ztbxxwefsrtzfjg6ffk2.png	
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: roshanbhogan
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
38c444b1-8c98-4183-af76-f5aa84cea639	61713ece3f02718e5c0ae7ecc93936ff9855b7e1ede6236bd1b7ce635f8bedd0	2025-08-07 14:04:41.790655+05:30	20250703060712_user_and_messages_model_created	\N	\N	2025-08-07 14:04:41.776569+05:30	1
4788d931-57e5-4558-a6af-2c49368b090d	2055724a001efbecb22775401025f343661aa764189bef585383f35a965e0f56	2025-08-07 14:04:41.792975+05:30	20250708064040_changed_the_user_schema	\N	\N	2025-08-07 14:04:41.791149+05:30	1
b5c34c0a-805e-47f7-95a0-fd1256804425	384a7b09dec6303da2842164a8f89ef6c7fe8c539b422d6706297d84e37da08c	2025-08-07 14:04:41.795007+05:30	20250709062758_added_time_to_the_messages	\N	\N	2025-08-07 14:04:41.793455+05:30	1
447c41ed-e4ea-4322-af28-89617cdc40ad	0a17faaf9478653116a36efd2caa87a0d196b33716329f26f18fdb79654b9df5	2025-08-07 14:04:41.809155+05:30	20250712075139_added_post_related_models	\N	\N	2025-08-07 14:04:41.79553+05:30	1
0ee3d958-4ce3-4a7e-9365-fc9acd6c4bc6	8c91c05a715bc8b68063b083119072c46f9795897ac073aa7362bb8849196519	2025-08-07 14:04:41.814986+05:30	20250715072717_added_friends_model_to_the_database	\N	\N	2025-08-07 14:04:41.809933+05:30	1
7c2b9247-31c6-46b9-8056-a1680342453a	1e56343ae9e1ff9f01eac157d11582f3d578fe9ac6bbc830e6d27b905096b54c	2025-08-07 14:04:41.817681+05:30	20250722091101_add_likes_unique_pair	\N	\N	2025-08-07 14:04:41.815463+05:30	1
9f8576e9-6e25-492a-b37f-2920d979e82d	25f36dff8140230cf25d27d9177d5d21bf47204615c3d7d9226f948a6a0f3f4e	2025-08-07 14:04:41.820215+05:30	20250730140714_	\N	\N	2025-08-07 14:04:41.818094+05:30	1
d61420e7-5ac8-4a80-af85-77b32eac1d67	2f8d29f94fce7b337e1a11abfe61b963d211760c56bb15a8e9d0fee80f5ff11f	2025-08-07 14:04:41.822058+05:30	20250806084231_made_changes_to_the_schema_of_post_table	\N	\N	2025-08-07 14:04:41.820598+05:30	1
1880bc46-1719-489c-83bf-22168fcbef9d	ee278a18889e52df178877ede1c5c6fd7179cdc96a3aab0632e3e51edb1789f0	2025-08-07 14:04:41.823597+05:30	20250806135012_made_photo_otional_so_that_user_can_only_post_text_tweets	\N	\N	2025-08-07 14:04:41.822422+05:30	1
233b4df7-77ac-4246-8c5e-f0829dd33c91	7c01450548f3fa197f4d6e520b86982f4b315110c2961293040066c17f94a3d3	2025-08-07 14:04:41.825088+05:30	20250806135230_make_photo_optional	\N	\N	2025-08-07 14:04:41.82395+05:30	1
a04b829d-6941-436c-ab42-f3c6c90370d7	ee278a18889e52df178877ede1c5c6fd7179cdc96a3aab0632e3e51edb1789f0	2025-08-07 14:04:41.826579+05:30	20250806141043_	\N	\N	2025-08-07 14:04:41.82548+05:30	1
ae0d149b-3005-43e1-9e4d-86e84640f55d	8565f5438b131951c732b098a1527e22d38bd571364785018f34b02652a4737c	2025-08-07 14:04:41.828164+05:30	20250807072116_make_changes_to_user_table	\N	\N	2025-08-07 14:04:41.826932+05:30	1
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: roshanbhogan
--

COPY public.session (sid, sess, expire) FROM stdin;
\.


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: roshanbhogan
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 26, true);


--
-- Name: Friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: roshanbhogan
--

SELECT pg_catalog.setval('public."Friends_id_seq"', 31, true);


--
-- Name: Likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: roshanbhogan
--

SELECT pg_catalog.setval('public."Likes_id_seq"', 34, true);


--
-- Name: Messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: roshanbhogan
--

SELECT pg_catalog.setval('public."Messages_id_seq"', 21, true);


--
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: roshanbhogan
--

SELECT pg_catalog.setval('public."Post_id_seq"', 44, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: roshanbhogan
--

SELECT pg_catalog.setval('public."User_id_seq"', 15, true);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Friends Friends_pkey; Type: CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "Friends_pkey" PRIMARY KEY (id);


--
-- Name: Likes Likes_pkey; Type: CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_pkey" PRIMARY KEY (id);


--
-- Name: Messages Messages_pkey; Type: CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: Friends_request_by_request_to_key; Type: INDEX; Schema: public; Owner: roshanbhogan
--

CREATE UNIQUE INDEX "Friends_request_by_request_to_key" ON public."Friends" USING btree (request_by, request_to);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: roshanbhogan
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: Likes_liked_by_post_id_key; Type: INDEX; Schema: public; Owner: roshanbhogan
--

CREATE UNIQUE INDEX "Likes_liked_by_post_id_key" ON public."Likes" USING btree (liked_by, post_id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: roshanbhogan
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: roshanbhogan
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Comment Comment_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friends Friends_request_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "Friends_request_by_fkey" FOREIGN KEY (request_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friends Friends_request_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "Friends_request_to_fkey" FOREIGN KEY (request_to) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Likes Likes_liked_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_liked_by_fkey" FOREIGN KEY (liked_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Likes Likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Messages Messages_receiverid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_receiverid_fkey" FOREIGN KEY (receiverid) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Messages Messages_senderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_senderid_fkey" FOREIGN KEY (senderid) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Post Post_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: roshanbhogan
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

