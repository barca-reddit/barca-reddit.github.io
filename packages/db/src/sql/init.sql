DO $$
BEGIN
    CREATE TYPE source_tier AS enum(
        'official',
        '1',
        '2',
        '3',
        '4',
        '5',
        'aggregator'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE source_type AS enum(
        'official',
        'journalist',
        'media',
        'aggregator'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE change_type AS enum(
        'addition',
        'removal',
        'promotion',
        'demotion'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

CREATE TABLE IF NOT EXISTS sources(
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_is_common BOOLEAN NOT NULL,
    type source_type NOT NULL,
    tier source_tier NOT NULL,
    organizations TEXT[],
    handles TEXT[],
    domains TEXT[],
    removed BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    UNIQUE (id),
    UNIQUE (NAME)
);

CREATE TABLE IF NOT EXISTS aliases(
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL,
    alias TEXT NOT NULL,
    alias_is_common BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (source_id, alias),
    FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE TABLE IF NOT EXISTS updates(
    date DATE NOT NULL,
    link TEXT,
    PRIMARY KEY (DATE),
    UNIQUE (DATE)
);

CREATE TABLE IF NOT EXISTS changes(
    type change_type NOT NULL,
    source_id UUID NOT NULL,
    update_date DATE NOT NULL,
    prev_tier source_tier,
    next_tier source_tier,
    UNIQUE (source_id, update_date),
    CHECK ((type = 'addition' AND prev_tier IS NULL AND next_tier IS NOT NULL) OR (type = 'removal' AND prev_tier IS NOT NULL AND next_tier IS NULL) OR (type IN ('promotion', 'demotion') AND prev_tier IS NOT NULL AND next_tier IS NOT NULL)),
    FOREIGN KEY (source_id) REFERENCES sources(id),
    FOREIGN KEY (update_date) REFERENCES updates(DATE)
);

