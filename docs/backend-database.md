# Backend Database Setup

The app currently runs with the local file store by default:

```txt
.data/bonsai-db.json
```

To move to PostgreSQL:

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`.
3. Set `BONSAI_DATA_MODE=prisma`.
4. Run:

```bash
npm run db:validate
npm run db:generate
npx prisma db push
npm run db:seed
```

The runtime repositories are still file-store backed until the Prisma repository swap is completed. The Prisma schema and seed are tracked so the database contract is explicit and ready for that switch.

Google OAuth keys can be saved from the admin Settings screen. The runtime config resolver reads the persisted server store first and only uses `.env` values to hydrate empty settings, so saved Google keys and the session cookie secret survive refreshes, restarts, and data resets.
