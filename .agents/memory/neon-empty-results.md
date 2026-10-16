---
name: Neon empty query results
description: Handling empty SQL result sets with this project's Replit PostgreSQL connection.
---

With this project's Replit PostgreSQL connection, `@neondatabase/serverless` can fail when a query returns zero rows because the response may contain `rows: null`. Use aggregate queries or a CTE whose outer query always returns one row when an empty result is valid. A Neon HTTP Drizzle select can hit the same failure.

**Why:** An empty favorites list is a normal state, but the driver attempted to map a null rows value and returned a server error.

**How to apply:** For read and mutation paths where zero matches are expected, make the SQL return a guaranteed row or use a PostgreSQL driver that handles empty results correctly.