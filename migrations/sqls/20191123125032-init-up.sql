CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.children (
    child_id uuid DEFAULT uuid_generate_v4(),
    dob date NOT NULL,
    given_name character varying NOT NULL,
    surname character varying NOT NULL,
    gender_id character varying NOT NULL,
    guardian_id uuid NOT NULL
);
ALTER TABLE public.children OWNER TO postgres;

CREATE TABLE public.consents (
    consent_id uuid DEFAULT uuid_generate_v4(),
    info_id character varying,
    receive_copy boolean NOT NULL,
    understand_consent boolean NOT NULL,
    info_sheet boolean NOT NULL,
    understand_aim boolean NOT NULL,
    opportunity_to_ask boolean NOT NULL,
    agree_to_participate boolean NOT NULL,
    result_id uuid NOT NULL
);
ALTER TABLE public.consents OWNER TO postgres;

CREATE TABLE public.guardians (
    guardian_id uuid DEFAULT uuid_generate_v4(),
    name character varying NOT NULL,
    email_address character varying NOT NULL
);
ALTER TABLE public.guardians OWNER TO postgres;

CREATE TABLE public.result_answers (
    result_answer_id uuid DEFAULT uuid_generate_v4(),
    question_id character varying(100) NOT NULL,
    questionnaire_id character varying(100) NOT NULL,
    answer_id character varying(100) NOT NULL,
    comments character varying,
    result_id uuid NOT NULL
);
ALTER TABLE public.result_answers OWNER TO postgres;

CREATE TABLE public.result_concerns (
    result_concern_id uuid DEFAULT uuid_generate_v4(),
    concern_id character varying NOT NULL,
    result_id uuid NOT NULL
);
ALTER TABLE public.result_concerns OWNER TO postgres;

CREATE TABLE public.results (
    result_id uuid  DEFAULT uuid_generate_v4(),
    date timestamp with time zone NOT NULL,
    language_id character varying(2) NOT NULL,
    site_id character varying(100) NOT NULL,
    doctor_email character varying NOT NULL,
    guardian_id uuid NOT NULL,
    child_id uuid NOT NULL
);
ALTER TABLE public.results OWNER TO postgres;

ALTER TABLE ONLY public.children
    ADD CONSTRAINT children_pkey PRIMARY KEY (child_id);

ALTER TABLE ONLY public.consents
    ADD CONSTRAINT consent_pkey PRIMARY KEY (consent_id);

ALTER TABLE ONLY public.guardians
    ADD CONSTRAINT guardians_pkey PRIMARY KEY (guardian_id);

ALTER TABLE ONLY public.result_concerns
    ADD CONSTRAINT result_concerns_pkey PRIMARY KEY (result_concern_id);

ALTER TABLE ONLY public.result_answers
    ADD CONSTRAINT results_answers_pkey PRIMARY KEY (result_answer_id);

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_pkey PRIMARY KEY (result_id);

ALTER TABLE ONLY public.result_answers
    ADD CONSTRAINT unique_answer_constraint UNIQUE (question_id, questionnaire_id, result_id);

CREATE INDEX fki_child_guardian_id ON public.children USING btree (guardian_id);

CREATE INDEX fki_consent_result ON public.consents USING btree (result_id);

CREATE INDEX fki_result_child_id ON public.results USING btree (child_id);

CREATE INDEX fki_result_concern_result_id ON public.result_concerns USING btree (result_id);

CREATE INDEX fki_result_guardian_id ON public.results USING btree (guardian_id);

ALTER TABLE ONLY public.children
    ADD CONSTRAINT child_guardian_id FOREIGN KEY (guardian_id) REFERENCES public.guardians(guardian_id) NOT VALID;

ALTER TABLE ONLY public.consents
    ADD CONSTRAINT consent_result FOREIGN KEY (result_id) REFERENCES public.results(result_id) NOT VALID;

ALTER TABLE ONLY public.results
    ADD CONSTRAINT result_child_id FOREIGN KEY (child_id) REFERENCES public.children(child_id) NOT VALID;

ALTER TABLE ONLY public.result_concerns
    ADD CONSTRAINT result_concern_result_id FOREIGN KEY (result_id) REFERENCES public.results(result_id) NOT VALID;

ALTER TABLE ONLY public.results
    ADD CONSTRAINT result_guardian_id FOREIGN KEY (guardian_id) REFERENCES public.guardians(guardian_id) NOT VALID;

ALTER TABLE ONLY public.result_answers
    ADD CONSTRAINT results_answers_results_fkey FOREIGN KEY (result_id) REFERENCES public.results(result_id) NOT VALID;