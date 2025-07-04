#! /bin/sh

if [ "$1" = "--local" ]; then
    sql="$(cat src/sql/drop.sql src/sql/tables.sql src/sql/views.sql src/sql/data.sql)"
elif [ "$1" = "--remote" ]; then
    sql="$(cat src/sql/tables.sql src/sql/views.sql src/sql/data.sql)"
else
    echo "Missing argument. Use --local or --remote."
    exit 1
fi

pnpm exec wrangler d1 execute media-reliability --command "$sql" "$1"