-- Table: public.reports

-- DROP TABLE public.reports;

CREATE TABLE public.reports
(
    tx_hash VARCHAR(128) NOT NULL, --Tx Hash
    report_json TEXT NOT NULL, --Report json
    report_id TEXT NOT NULL, --Report json
	report_hash VARCHAR(128) NOT NULL, --Report Hash
    created timestamp  NOT NULL DEFAULT now(), --Created on
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.reports
    OWNER to "USERNAME"
