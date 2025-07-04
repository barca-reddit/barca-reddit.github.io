CREATE VIEW IF NOT EXISTS sources_list AS
SELECT
    sources.*,
(
        SELECT
            update_date
        FROM
            updates
        WHERE
            updates.source_id = sources.id
            AND updates.type = 'addition'
        ORDER BY
            update_date ASC
        LIMIT 1) AS added_on,
(
    SELECT
        update_date
    FROM
        updates
    WHERE
        updates.source_id = sources.id
        AND updates.type IN ('promotion', 'demotion')
    ORDER BY
        update_date DESC
    LIMIT 1) AS updated_on
FROM
    sources
WHERE
    sources.removed = 0
ORDER BY
    CASE WHEN sources.tier = 'official' THEN
        1
    WHEN sources.tier = '1' THEN
        2
    WHEN sources.tier = '2' THEN
        3
    WHEN sources.tier = '3' THEN
        4
    WHEN sources.tier = '4' THEN
        5
    WHEN sources.tier = '5' THEN
        6
    WHEN sources.tier = 'aggregator' THEN
        7
    END ASC,
    CASE WHEN sources.type = 'official' THEN
        1
    WHEN sources.type = 'journalist' THEN
        2
    WHEN sources.type = 'media' THEN
        3
    WHEN sources.type = 'aggregator' THEN
        4
    END ASC,
    sources.name ASC;

CREATE VIEW IF NOT EXISTS updates_list AS
SELECT
    updates.*,
    sources.name AS source_name
FROM
    updates
    JOIN sources ON sources.id = updates.source_id
ORDER BY
    update_date DESC,
    CASE WHEN updates.type = 'promotion' THEN
        1
    WHEN updates.type = 'demotion' THEN
        2
    WHEN updates.type = 'addition' THEN
        3
    WHEN updates.type = 'removal' THEN
        4
    END,
    sources.name ASC;

CREATE VIEW IF NOT EXISTS meta_latest AS
SELECT
    update_date AS last_update
FROM
    updates
ORDER BY
    updates.update_date DESC
LIMIT 1;

