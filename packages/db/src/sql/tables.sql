CREATE TABLE IF NOT EXISTS sources(
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    name_is_common INTEGER NOT NULL,
    type TEXT NOT NULL,
    tier TEXT NOT NULL,
    orgs TEXT,
    handles TEXT,
    aliases TEXT,
    domains TEXT,
    removed INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE (id),
    UNIQUE (NAME),
    CHECK (name_is_common IN (0, 1)),
    CHECK (orgs IS NULL OR (json_valid(orgs) AND json_type(orgs) = 'array')),
    CHECK (handles IS NULL OR (json_valid(handles) AND json_type(handles) = 'array')),
    CHECK (aliases IS NULL OR (json_valid(handles) AND json_type(handles) = 'array')),
    CHECK (domains IS NULL OR (json_valid(domains) AND json_type(domains) = 'array')),
    CHECK (type IN ('official', 'journalist', 'media', 'aggregator')),
    CHECK (tier IN ('official', '1', '2', '3', '4', '5', 'aggregator')),
    CHECK (removed IN (0, 1)))
STRICT;

CREATE TABLE IF NOT EXISTS updates(
    type TEXT NOT NULL,
    source_id TEXT NOT NULL,
    update_date TEXT NOT NULL,
    prev_tier TEXT,
    next_tier TEXT,
    UNIQUE (source_id, update_date),
    CHECK (type IN ('addition', 'removal', 'promotion', 'demotion')),
    CHECK (prev_tier IS NULL OR prev_tier IN ('official', '1', '2', '3', '4', '5', 'aggregator')),
    CHECK (next_tier IS NULL OR next_tier IN ('official', '1', '2', '3', '4', '5', 'aggregator')),
    CHECK ((type = 'addition' AND prev_tier IS NULL AND next_tier IS NOT NULL) OR (type = 'removal' AND prev_tier IS NOT NULL AND next_tier IS NULL) OR (type IN ('promotion', 'demotion') AND prev_tier IS NOT NULL AND next_tier IS NOT NULL)),
    FOREIGN KEY (source_id) REFERENCES sources(id))
STRICT;

