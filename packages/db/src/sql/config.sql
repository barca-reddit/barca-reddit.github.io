ALTER DATABASE media_reliability SET work_mem TO '64MB';

ALTER DATABASE media_reliability SET timezone = 'UTC';

CREATE EXTENSION IF NOT EXISTS unaccent;

