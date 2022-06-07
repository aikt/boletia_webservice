--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.3

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
-- Name: catalog_divisas; Type: TABLE; Schema: public; Owner: boletia
--

CREATE TABLE public.catalog_divisas (
    id integer NOT NULL,
    name character varying(3)
);


ALTER TABLE public.catalog_divisas OWNER TO boletia;

--
-- Name: catalog_divisas_id_seq; Type: SEQUENCE; Schema: public; Owner: boletia
--

CREATE SEQUENCE public.catalog_divisas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.catalog_divisas_id_seq OWNER TO boletia;

--
-- Name: catalog_divisas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boletia
--

ALTER SEQUENCE public.catalog_divisas_id_seq OWNED BY public.catalog_divisas.id;


--
-- Name: divisas; Type: TABLE; Schema: public; Owner: boletia
--

CREATE TABLE public.divisas (
    id integer NOT NULL,
    valor real,
    divisa_name_id integer
);


ALTER TABLE public.divisas OWNER TO boletia;

--
-- Name: divisas_has_tiempos; Type: TABLE; Schema: public; Owner: boletia
--

CREATE TABLE public.divisas_has_tiempos (
    divisa_id integer,
    tiempo_id integer
);


ALTER TABLE public.divisas_has_tiempos OWNER TO boletia;

--
-- Name: divisas_id_seq; Type: SEQUENCE; Schema: public; Owner: boletia
--

CREATE SEQUENCE public.divisas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.divisas_id_seq OWNER TO boletia;

--
-- Name: divisas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boletia
--

ALTER SEQUENCE public.divisas_id_seq OWNED BY public.divisas.id;


--
-- Name: divisas_tiempo; Type: TABLE; Schema: public; Owner: boletia
--

CREATE TABLE public.divisas_tiempo (
    id integer NOT NULL,
    tiempo timestamp without time zone
);


ALTER TABLE public.divisas_tiempo OWNER TO boletia;

--
-- Name: divisas_tiempo_id_seq; Type: SEQUENCE; Schema: public; Owner: boletia
--

CREATE SEQUENCE public.divisas_tiempo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.divisas_tiempo_id_seq OWNER TO boletia;

--
-- Name: divisas_tiempo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boletia
--

ALTER SEQUENCE public.divisas_tiempo_id_seq OWNED BY public.divisas_tiempo.id;


--
-- Name: llamadas_api; Type: TABLE; Schema: public; Owner: boletia
--

CREATE TABLE public.llamadas_api (
    id integer NOT NULL,
    status boolean,
    tiempo_ejecucion timestamp without time zone,
    tiempo_duracion integer
);


ALTER TABLE public.llamadas_api OWNER TO boletia;

--
-- Name: llamadas_api_id_seq; Type: SEQUENCE; Schema: public; Owner: boletia
--

CREATE SEQUENCE public.llamadas_api_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.llamadas_api_id_seq OWNER TO boletia;

--
-- Name: llamadas_api_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: boletia
--

ALTER SEQUENCE public.llamadas_api_id_seq OWNED BY public.llamadas_api.id;


--
-- Name: catalog_divisas id; Type: DEFAULT; Schema: public; Owner: boletia
--

ALTER TABLE ONLY public.catalog_divisas ALTER COLUMN id SET DEFAULT nextval('public.catalog_divisas_id_seq'::regclass);


--
-- Name: divisas id; Type: DEFAULT; Schema: public; Owner: boletia
--

ALTER TABLE ONLY public.divisas ALTER COLUMN id SET DEFAULT nextval('public.divisas_id_seq'::regclass);


--
-- Name: divisas_tiempo id; Type: DEFAULT; Schema: public; Owner: boletia
--

ALTER TABLE ONLY public.divisas_tiempo ALTER COLUMN id SET DEFAULT nextval('public.divisas_tiempo_id_seq'::regclass);


--
-- Name: llamadas_api id; Type: DEFAULT; Schema: public; Owner: boletia
--

ALTER TABLE ONLY public.llamadas_api ALTER COLUMN id SET DEFAULT nextval('public.llamadas_api_id_seq'::regclass);


--
-- Data for Name: catalog_divisas; Type: TABLE DATA; Schema: public; Owner: boletia
--

COPY public.catalog_divisas (id, name) FROM stdin;
\.


--
-- Data for Name: divisas; Type: TABLE DATA; Schema: public; Owner: boletia
--

COPY public.divisas (id, valor, divisa_name_id) FROM stdin;
\.


--
-- Data for Name: divisas_has_tiempos; Type: TABLE DATA; Schema: public; Owner: boletia
--

COPY public.divisas_has_tiempos (divisa_id, tiempo_id) FROM stdin;
\.


--
-- Data for Name: divisas_tiempo; Type: TABLE DATA; Schema: public; Owner: boletia
--

COPY public.divisas_tiempo (id, tiempo) FROM stdin;
\.


--
-- Data for Name: llamadas_api; Type: TABLE DATA; Schema: public; Owner: boletia
--

COPY public.llamadas_api (id, status, tiempo_ejecucion, tiempo_duracion) FROM stdin;
\.


--
-- Name: catalog_divisas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: boletia
--

SELECT pg_catalog.setval('public.catalog_divisas_id_seq', 1, false);


--
-- Name: divisas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: boletia
--

SELECT pg_catalog.setval('public.divisas_id_seq', 1, false);


--
-- Name: divisas_tiempo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: boletia
--

SELECT pg_catalog.setval('public.divisas_tiempo_id_seq', 1, false);


--
-- Name: llamadas_api_id_seq; Type: SEQUENCE SET; Schema: public; Owner: boletia
--

SELECT pg_catalog.setval('public.llamadas_api_id_seq', 1, false);


--
-- Name: catalog_divisas catalog_divisas_pkey; Type: CONSTRAINT; Schema: public; Owner: boletia
--

ALTER TABLE ONLY public.catalog_divisas
    ADD CONSTRAINT catalog_divisas_pkey PRIMARY KEY (id);


--
-- Name: divisas divisas_pkey; Type: CONSTRAINT; Schema: public; Owner: boletia
--

ALTER TABLE ONLY public.divisas
    ADD CONSTRAINT divisas_pkey PRIMARY KEY (id);


--
-- Name: divisas_tiempo divisas_tiempo_pkey; Type: CONSTRAINT; Schema: public; Owner: boletia
--

ALTER TABLE ONLY public.divisas_tiempo
    ADD CONSTRAINT divisas_tiempo_pkey PRIMARY KEY (id);


--
-- Name: llamadas_api llamadas_api_pkey; Type: CONSTRAINT; Schema: public; Owner: boletia
--

ALTER TABLE ONLY public.llamadas_api
    ADD CONSTRAINT llamadas_api_pkey PRIMARY KEY (id);


--
-- Name: divisas_has_tiempos fk_divisas; Type: FK CONSTRAINT; Schema: public; Owner: boletia
--

ALTER TABLE ONLY public.divisas_has_tiempos
    ADD CONSTRAINT fk_divisas FOREIGN KEY (divisa_id) REFERENCES public.divisas(id);


--
-- Name: divisas fk_divisas_name; Type: FK CONSTRAINT; Schema: public; Owner: boletia
--

ALTER TABLE ONLY public.divisas
    ADD CONSTRAINT fk_divisas_name FOREIGN KEY (divisa_name_id) REFERENCES public.catalog_divisas(id);


--
-- Name: divisas_has_tiempos fk_divisas_tiempo; Type: FK CONSTRAINT; Schema: public; Owner: boletia
--

ALTER TABLE ONLY public.divisas_has_tiempos
    ADD CONSTRAINT fk_divisas_tiempo FOREIGN KEY (tiempo_id) REFERENCES public.divisas_tiempo(id);


--
-- PostgreSQL database dump complete
--

