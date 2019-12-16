
--
-- TOC entry 2931 (class 1262 OID 16384)
-- Name: watch-me-grow; Type: DATABASE; Schema: -; Owner: postgres
--


-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- SET default_tablespace = '';

--
-- TOC entry 201 (class 1259 OID 16428)
-- Name: children; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.children (
    child_id integer NOT NULL,
    dob date NOT NULL,
    given_name character varying NOT NULL,
    surname character varying NOT NULL,
    gender_id character varying NOT NULL,
    guardian_id integer NOT NULL
);


ALTER TABLE public.children OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 16426)
-- Name: children_child_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.children_child_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.children_child_id_seq OWNER TO postgres;

--
-- TOC entry 2932 (class 0 OID 0)
-- Dependencies: 200
-- Name: children_child_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.children_child_id_seq OWNED BY public.children.child_id;


--
-- TOC entry 207 (class 1259 OID 16485)
-- Name: consent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consent (
    consent_id integer NOT NULL,
    info_id character varying,
    receive_copy boolean NOT NULL,
    understand_consent boolean NOT NULL,
    info_sheet boolean NOT NULL,
    understand_aim boolean NOT NULL,
    opportunity_to_ask boolean NOT NULL,
    agree_to_participate boolean NOT NULL,
    result_id integer NOT NULL
);


ALTER TABLE public.consent OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16483)
-- Name: consent_consent_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consent_consent_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.consent_consent_id_seq OWNER TO postgres;

--
-- TOC entry 2933 (class 0 OID 0)
-- Dependencies: 206
-- Name: consent_consent_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consent_consent_id_seq OWNED BY public.consent.consent_id;


--
-- TOC entry 203 (class 1259 OID 16439)
-- Name: guardians; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guardians (
    guardian_id integer NOT NULL,
    name character varying NOT NULL,
    email_address character varying NOT NULL
);


ALTER TABLE public.guardians OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16437)
-- Name: guardians_guardian_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.guardians_guardian_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.guardians_guardian_id_seq OWNER TO postgres;

--
-- TOC entry 2934 (class 0 OID 0)
-- Dependencies: 202
-- Name: guardians_guardian_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.guardians_guardian_id_seq OWNED BY public.guardians.guardian_id;


--
-- TOC entry 199 (class 1259 OID 16406)
-- Name: result_answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.result_answers (
    result_answer_id integer NOT NULL,
    question_id character varying(100) NOT NULL,
    questionnaire_id character varying(100) NOT NULL,
    answer_id character varying(100) NOT NULL,
    result_id integer NOT NULL
);


ALTER TABLE public.result_answers OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 16450)
-- Name: result_concerns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.result_concerns (
    result_concern_id integer NOT NULL,
    concern_id character varying NOT NULL,
    result_id integer NOT NULL
);


ALTER TABLE public.result_concerns OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16448)
-- Name: result_concerns_result_concern_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.result_concerns_result_concern_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.result_concerns_result_concern_id_seq OWNER TO postgres;

--
-- TOC entry 2935 (class 0 OID 0)
-- Dependencies: 204
-- Name: result_concerns_result_concern_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.result_concerns_result_concern_id_seq OWNED BY public.result_concerns.result_concern_id;


--
-- TOC entry 196 (class 1259 OID 16385)
-- Name: results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.results (
    result_id integer NOT NULL,
    date date NOT NULL,
    language_id character varying(2) NOT NULL,
    site_id character varying(100) NOT NULL,
    guardian_id integer NOT NULL,
    child_id integer NOT NULL
);


ALTER TABLE public.results OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 16404)
-- Name: results_answers_result_answer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.results_answers_result_answer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.results_answers_result_answer_id_seq OWNER TO postgres;

--
-- TOC entry 2936 (class 0 OID 0)
-- Dependencies: 198
-- Name: results_answers_result_answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.results_answers_result_answer_id_seq OWNED BY public.result_answers.result_answer_id;


--
-- TOC entry 197 (class 1259 OID 16396)
-- Name: results_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.results_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.results_results_id_seq OWNER TO postgres;

--
-- TOC entry 2937 (class 0 OID 0)
-- Dependencies: 197
-- Name: results_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.results_results_id_seq OWNED BY public.results.result_id;


--
-- TOC entry 2776 (class 2604 OID 16431)
-- Name: children child_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.children ALTER COLUMN child_id SET DEFAULT nextval('public.children_child_id_seq'::regclass);


--
-- TOC entry 2779 (class 2604 OID 16488)
-- Name: consent consent_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consent ALTER COLUMN consent_id SET DEFAULT nextval('public.consent_consent_id_seq'::regclass);


--
-- TOC entry 2777 (class 2604 OID 16442)
-- Name: guardians guardian_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guardians ALTER COLUMN guardian_id SET DEFAULT nextval('public.guardians_guardian_id_seq'::regclass);


--
-- TOC entry 2775 (class 2604 OID 16409)
-- Name: result_answers result_answer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result_answers ALTER COLUMN result_answer_id SET DEFAULT nextval('public.results_answers_result_answer_id_seq'::regclass);


--
-- TOC entry 2778 (class 2604 OID 16453)
-- Name: result_concerns result_concern_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result_concerns ALTER COLUMN result_concern_id SET DEFAULT nextval('public.result_concerns_result_concern_id_seq'::regclass);


--
-- TOC entry 2774 (class 2604 OID 16398)
-- Name: results result_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results ALTER COLUMN result_id SET DEFAULT nextval('public.results_results_id_seq'::regclass);


--
-- TOC entry 2789 (class 2606 OID 16436)
-- Name: children children_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_pkey PRIMARY KEY (child_id);


--
-- TOC entry 2797 (class 2606 OID 16493)
-- Name: consent consent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consent
    ADD CONSTRAINT consent_pkey PRIMARY KEY (consent_id);


--
-- TOC entry 2792 (class 2606 OID 16447)
-- Name: guardians guardians_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guardians
    ADD CONSTRAINT guardians_pkey PRIMARY KEY (guardian_id);


--
-- TOC entry 2795 (class 2606 OID 16458)
-- Name: result_concerns result_concerns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result_concerns
    ADD CONSTRAINT result_concerns_pkey PRIMARY KEY (result_concern_id);


--
-- TOC entry 2785 (class 2606 OID 16411)
-- Name: result_answers results_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result_answers
    ADD CONSTRAINT results_answers_pkey PRIMARY KEY (result_answer_id);


--
-- TOC entry 2783 (class 2606 OID 16403)
-- Name: results results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_pkey PRIMARY KEY (result_id);


--
-- TOC entry 2787 (class 2606 OID 16420)
-- Name: result_answers unique_answer_constraint; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result_answers
    ADD CONSTRAINT unique_answer_constraint UNIQUE (question_id, questionnaire_id, result_id);


--
-- TOC entry 2790 (class 1259 OID 16464)
-- Name: fki_child_guardian_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_child_guardian_id ON public.children USING btree (guardian_id);


--
-- TOC entry 2798 (class 1259 OID 16499)
-- Name: fki_consent_result; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_consent_result ON public.consent USING btree (result_id);


--
-- TOC entry 2780 (class 1259 OID 16470)
-- Name: fki_result_child_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_result_child_id ON public.results USING btree (child_id);


--
-- TOC entry 2793 (class 1259 OID 16482)
-- Name: fki_result_concern_result_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_result_concern_result_id ON public.result_concerns USING btree (result_id);


--
-- TOC entry 2781 (class 1259 OID 16476)
-- Name: fki_result_guardian_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_result_guardian_id ON public.results USING btree (guardian_id);


--
-- TOC entry 2802 (class 2606 OID 16459)
-- Name: children child_guardian_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.children
    ADD CONSTRAINT child_guardian_id FOREIGN KEY (guardian_id) REFERENCES public.guardians(guardian_id) NOT VALID;


--
-- TOC entry 2804 (class 2606 OID 16494)
-- Name: consent consent_result; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consent
    ADD CONSTRAINT consent_result FOREIGN KEY (result_id) REFERENCES public.results(result_id) NOT VALID;


--
-- TOC entry 2799 (class 2606 OID 16465)
-- Name: results result_child_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT result_child_id FOREIGN KEY (child_id) REFERENCES public.children(child_id) NOT VALID;


--
-- TOC entry 2803 (class 2606 OID 16477)
-- Name: result_concerns result_concern_result_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result_concerns
    ADD CONSTRAINT result_concern_result_id FOREIGN KEY (result_id) REFERENCES public.results(result_id) NOT VALID;


--
-- TOC entry 2800 (class 2606 OID 16471)
-- Name: results result_guardian_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT result_guardian_id FOREIGN KEY (guardian_id) REFERENCES public.guardians(guardian_id) NOT VALID;


--
-- TOC entry 2801 (class 2606 OID 16412)
-- Name: result_answers results_answers_results_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.result_answers
    ADD CONSTRAINT results_answers_results_fkey FOREIGN KEY (result_id) REFERENCES public.results(result_id) NOT VALID;


-- Completed on 2019-11-28 21:07:26 AEDT

--
-- PostgreSQL database dump complete
--

