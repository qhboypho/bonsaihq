# Bonsai Backend Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current localStorage-only bonsai demo with a real backend for users, artisans, trees, moderation, guestbook entries, and image uploads.

**Architecture:** Keep the current Next.js App Router frontend, then add a backend-for-frontend layer under `app/api/**/route.js`. Put database access, authorization, DTO shaping, and validation in `lib/server/**` so Route Handlers stay thin and Client Components never receive sensitive fields.

**Tech Stack:** Next.js 16 App Router Route Handlers, PostgreSQL, Prisma or Drizzle, Zod, Auth.js or an equivalent Next-compatible auth provider, object storage for images, Playwright for core flows, ESLint.

---

## Current State

The app is frontend-first. `app/providers.js` owns `theme`, `lang`, `db`, and toasts. `lib/db.js` seeds `DEFAULT_ARTISANS` and `DEFAULT_TREES`, then persists everything in browser `localStorage` through `getDbState()` and `saveDbState()`. The upload page creates tree records locally. The settings page toggles moderation locally. The artisan guestbook only updates local browser state.

Next.js 16 docs checked locally:
- Route Handlers live in `app/**/route.js`; supported methods include `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.
- Dynamic route handler params are async and must be awaited: `const { id } = await params`.
- Route Handlers are public endpoints and must do auth/authorization checks close to the data source.
- Server-side data access should use a DAL/DTO layer and should avoid exposing full database objects to Client Components.

## Target Domain Model

Use these entities as the backend contract.

```txt
User
- id
- email
- name
- role: ADMIN | ARTISAN | MEMBER
- createdAt
- updatedAt

Artisan
- id
- userId nullable
- slug
- name
- rank
- location
- bio
- phone
- zalo
- avatarUrl
- coverUrl
- createdAt
- updatedAt

Tree
- id
- ownerId
- title
- species
- style
- size
- age
- origin
- status: EXHIBIT | SALE | TRAINING
- price nullable
- story
- approved
- createdAt
- updatedAt

TreeImage
- id
- treeId
- url
- alt
- sortOrder
- createdAt

TreeTimelineStep
- id
- treeId
- year
- description
- sortOrder

GuestbookEntry
- id
- artisanId
- authorName
- contact nullable
- content
- approved
- createdAt

AppSetting
- key
- value
- updatedAt
```

## API Contract

```txt
GET    /api/bootstrap
GET    /api/artisans
GET    /api/artisans/[id]
GET    /api/artisans/[id]/trees
POST   /api/artisans/[id]/guestbook
GET    /api/trees
POST   /api/trees
GET    /api/trees/[id]
PATCH  /api/trees/[id]
DELETE /api/trees/[id]
POST   /api/uploads/sign
GET    /api/settings
PATCH  /api/settings/moderation
GET    /api/admin/moderation/trees
PATCH  /api/admin/moderation/trees/[id]
```

Responses should use this stable envelope:

```js
Response.json({ data })
Response.json({ error: { code: "VALIDATION_ERROR", message, fields } }, { status: 400 })
```

## Proposed File Structure

```txt
app/api/bootstrap/route.js
app/api/artisans/route.js
app/api/artisans/[id]/route.js
app/api/artisans/[id]/trees/route.js
app/api/artisans/[id]/guestbook/route.js
app/api/trees/route.js
app/api/trees/[id]/route.js
app/api/uploads/sign/route.js
app/api/settings/route.js
app/api/settings/moderation/route.js
app/api/admin/moderation/trees/route.js
app/api/admin/moderation/trees/[id]/route.js
lib/server/db.js
lib/server/auth.js
lib/server/permissions.js
lib/server/validation.js
lib/server/dto.js
lib/server/errors.js
lib/server/repositories/artisans.js
lib/server/repositories/trees.js
lib/server/repositories/settings.js
lib/api-client.js
lib/shared/constants.js
prisma/schema.prisma
prisma/seed.js
tests/api/trees.test.js
tests/api/artisans.test.js
tests/api/settings.test.js
```

---

### Task 1: Freeze The Frontend Data Contract

**Files:**
- Create: `lib/shared/constants.js`
- Create: `lib/server/dto.js`
- Modify: `app/page.js`
- Modify: `app/tree/[id]/page.js`
- Modify: `app/artisan/[id]/page.js`
- Test: `npm run lint`

- [ ] **Step 1: Extract shared constants**

Create `lib/shared/constants.js`:

```js
export const TREE_STATUSES = {
  EXHIBIT: "Trưng bày",
  SALE: "Đang giao lưu",
  TRAINING: "Đang nuôi dưỡng",
};

export const TREE_STYLES = [
  "Trực",
  "Trực Lắc",
  "Huyền / Thác Đổ",
  "Hoành",
  "Xiêu / Tà",
  "Bạt Phong",
];

export const TREE_SIZES = ["mini", "small", "medium", "large"];
```

- [ ] **Step 2: Extract DTO shapes**

Create `lib/server/dto.js`:

```js
export function toTreeCardDTO(tree, owner) {
  return {
    id: tree.id,
    ownerId: tree.ownerId,
    ownerName: owner?.name || "",
    title: tree.title,
    species: tree.species,
    style: tree.style,
    size: tree.size,
    status: tree.status,
    price: tree.price || "",
    approved: Boolean(tree.approved),
    images: Array.isArray(tree.images) ? tree.images : [],
  };
}

export function toTreeDetailDTO(tree, owner) {
  return {
    ...toTreeCardDTO(tree, owner),
    age: tree.age || "",
    origin: tree.origin || "",
    story: tree.story || "",
    timeline: Array.isArray(tree.timeline) ? tree.timeline : [],
    owner: owner
      ? {
          id: owner.id,
          name: owner.name,
          phone: owner.phone || "",
          zalo: owner.zalo || "",
        }
      : null,
  };
}

export function toArtisanDTO(artisan, counts = {}) {
  return {
    id: artisan.id,
    name: artisan.name,
    rank: artisan.rank || "",
    location: artisan.location || "",
    bio: artisan.bio || "",
    avatarUrl: artisan.avatarUrl || artisan.avatar || "",
    coverUrl: artisan.coverUrl || artisan.cover || "",
    phone: artisan.phone || "",
    zalo: artisan.zalo || "",
    counts: {
      totalTrees: counts.totalTrees || 0,
      exhibitTrees: counts.exhibitTrees || 0,
      saleTrees: counts.saleTrees || 0,
    },
  };
}
```

- [ ] **Step 3: Replace duplicated status/style helpers**

Move repeated `langStyle` and `getStatusText` logic out of route components into shared helpers before touching backend. Keep behavior identical.

- [ ] **Step 4: Verify no behavior changed**

Run:

```bash
npm run lint
```

Expected: ESLint exits successfully.

---

### Task 2: Add Database And Seed Data

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.js`
- Create: `lib/server/db.js`
- Modify: `package.json`
- Test: `npx prisma validate`

- [ ] **Step 1: Install dependencies**

Run:

```bash
npm install prisma @prisma/client zod
npm install -D vitest
```

- [ ] **Step 2: Define schema**

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      UserRole @default(MEMBER)
  artisan   Artisan?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Artisan {
  id        String   @id @default(cuid())
  userId    String?  @unique
  slug      String   @unique
  name      String
  rank      String?
  location  String?
  bio       String?
  phone     String?
  zalo      String?
  avatarUrl String?
  coverUrl  String?
  user      User?    @relation(fields: [userId], references: [id])
  trees     Tree[]
  guestbook GuestbookEntry[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Tree {
  id        String       @id @default(cuid())
  ownerId   String
  title     Json
  species   Json
  style     String
  size      String
  age       String?
  origin    Json?
  status    TreeStatus
  price     String?
  story     Json?
  approved  Boolean      @default(false)
  owner     Artisan      @relation(fields: [ownerId], references: [id])
  images    TreeImage[]
  timeline  TreeTimelineStep[]
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  @@index([ownerId])
  @@index([approved, status])
}

model TreeImage {
  id        String   @id @default(cuid())
  treeId    String
  url       String
  alt       String?
  sortOrder Int      @default(0)
  tree      Tree     @relation(fields: [treeId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

model TreeTimelineStep {
  id          String @id @default(cuid())
  treeId      String
  year        String
  description Json
  sortOrder   Int    @default(0)
  tree        Tree   @relation(fields: [treeId], references: [id], onDelete: Cascade)
}

model GuestbookEntry {
  id         String   @id @default(cuid())
  artisanId  String
  authorName String
  contact    String?
  content    String
  approved   Boolean  @default(true)
  artisan    Artisan  @relation(fields: [artisanId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
}

model AppSetting {
  key       String   @id
  value     Json
  updatedAt DateTime @updatedAt
}

enum UserRole {
  ADMIN
  ARTISAN
  MEMBER
}

enum TreeStatus {
  EXHIBIT
  SALE
  TRAINING
}
```

- [ ] **Step 3: Add Prisma singleton**

Create `lib/server/db.js`:

```js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 4: Validate schema**

Run:

```bash
npx prisma validate
```

Expected: Prisma reports the schema is valid.

---

### Task 3: Build Thin Route Handlers

**Files:**
- Create: `lib/server/errors.js`
- Create: `lib/server/validation.js`
- Create: `lib/server/repositories/trees.js`
- Create: `app/api/trees/route.js`
- Create: `app/api/trees/[id]/route.js`
- Test: `tests/api/trees.test.js`

- [ ] **Step 1: Add response helpers**

Create `lib/server/errors.js`:

```js
export function ok(data, init) {
  return Response.json({ data }, init);
}

export function fail(status, code, message, fields) {
  return Response.json(
    { error: { code, message, fields: fields || {} } },
    { status }
  );
}
```

- [ ] **Step 2: Add tree validation**

Create `lib/server/validation.js`:

```js
import { z } from "zod";

const localizedText = z.object({
  vi: z.string().min(1),
  en: z.string().optional(),
  ja: z.string().optional(),
});

export const createTreeSchema = z.object({
  ownerId: z.string().min(1),
  title: localizedText,
  species: localizedText,
  style: z.string().min(1),
  size: z.string().min(1),
  age: z.string().optional(),
  origin: localizedText.optional(),
  status: z.enum(["EXHIBIT", "SALE", "TRAINING"]),
  price: z.string().optional(),
  story: localizedText.optional(),
  images: z.array(z.string().url()).min(1).max(5),
  timeline: z
    .array(
      z.object({
        year: z.string().min(1),
        description: localizedText,
      })
    )
    .default([]),
});
```

- [ ] **Step 3: Add tree repository**

Create `lib/server/repositories/trees.js`:

```js
import { prisma } from "../db";

export async function listApprovedTrees(filters = {}) {
  return prisma.tree.findMany({
    where: {
      approved: true,
      style: filters.style || undefined,
      size: filters.size || undefined,
    },
    include: {
      owner: true,
      images: { orderBy: { sortOrder: "asc" } },
      timeline: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTreeById(id) {
  return prisma.tree.findUnique({
    where: { id },
    include: {
      owner: true,
      images: { orderBy: { sortOrder: "asc" } },
      timeline: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function createTree(input, approved) {
  return prisma.tree.create({
    data: {
      ownerId: input.ownerId,
      title: input.title,
      species: input.species,
      style: input.style,
      size: input.size,
      age: input.age || "",
      origin: input.origin || {},
      status: input.status,
      price: input.price || "",
      story: input.story || {},
      approved,
      images: {
        create: input.images.map((url, index) => ({ url, sortOrder: index })),
      },
      timeline: {
        create: input.timeline.map((step, index) => ({
          year: step.year,
          description: step.description,
          sortOrder: index,
        })),
      },
    },
    include: {
      owner: true,
      images: { orderBy: { sortOrder: "asc" } },
      timeline: { orderBy: { sortOrder: "asc" } },
    },
  });
}
```

- [ ] **Step 4: Add `/api/trees`**

Create `app/api/trees/route.js`:

```js
import { ok, fail } from "../../../lib/server/errors";
import { createTreeSchema } from "../../../lib/server/validation";
import { createTree, listApprovedTrees } from "../../../lib/server/repositories/trees";
import { prisma } from "../../../lib/server/db";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const trees = await listApprovedTrees({
    style: searchParams.get("style") || undefined,
    size: searchParams.get("size") || undefined,
  });
  return ok(trees);
}

export async function POST(request) {
  const body = await request.json();
  const parsed = createTreeSchema.safeParse(body);

  if (!parsed.success) {
    return fail(400, "VALIDATION_ERROR", "Tree payload is invalid.", parsed.error.flatten().fieldErrors);
  }

  const setting = await prisma.appSetting.findUnique({ where: { key: "moderationRequired" } });
  const moderationRequired = Boolean(setting?.value);
  const tree = await createTree(parsed.data, !moderationRequired);

  return ok(tree, { status: 201 });
}
```

- [ ] **Step 5: Add `/api/trees/[id]`**

Create `app/api/trees/[id]/route.js`:

```js
import { ok, fail } from "../../../../lib/server/errors";
import { getTreeById } from "../../../../lib/server/repositories/trees";

export async function GET(_request, { params }) {
  const { id } = await params;
  const tree = await getTreeById(id);

  if (!tree || !tree.approved) {
    return fail(404, "NOT_FOUND", "Tree was not found.");
  }

  return ok(tree);
}
```

---

### Task 4: Add Auth And Permissions

**Files:**
- Create: `lib/server/auth.js`
- Create: `lib/server/permissions.js`
- Modify: `app/api/trees/route.js`
- Modify: `app/api/settings/moderation/route.js`
- Test: `tests/api/settings.test.js`

- [ ] **Step 1: Add session contract**

Create `lib/server/auth.js`:

```js
import "server-only";

export async function getCurrentUser() {
  return null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: new Response(null, { status: 401 }) };
  }
  return { user };
}
```

- [ ] **Step 2: Add permission helpers**

Create `lib/server/permissions.js`:

```js
export function canCreateTree(user, ownerId) {
  return user?.role === "ADMIN" || user?.artisanId === ownerId;
}

export function canModerate(user) {
  return user?.role === "ADMIN";
}
```

- [ ] **Step 3: Wire real auth provider**

Replace `getCurrentUser()` with Auth.js, Supabase Auth, Clerk, or another chosen provider. Keep the return shape stable:

```js
{
  id: "user-id",
  email: "name@example.com",
  role: "ADMIN",
  artisanId: "artisan-id"
}
```

---

### Task 5: Migrate Frontend From localStorage To API

**Files:**
- Create: `lib/api-client.js`
- Modify: `app/providers.js`
- Modify: `app/page.js`
- Modify: `app/upload/page.js`
- Modify: `app/settings/page.js`
- Test: `npm run lint`

- [ ] **Step 1: Add API client**

Create `lib/api-client.js`:

```js
async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload.error?.message || "Request failed.";
    throw new Error(message);
  }

  return payload.data;
}

export const api = {
  bootstrap: () => request("/api/bootstrap"),
  listTrees: (params = "") => request(`/api/trees${params}`),
  getTree: (id) => request(`/api/trees/${id}`),
  createTree: (input) =>
    request("/api/trees", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateModeration: (moderationRequired) =>
    request("/api/settings/moderation", {
      method: "PATCH",
      body: JSON.stringify({ moderationRequired }),
    }),
};
```

- [ ] **Step 2: Keep local seed as dev fallback only**

In `app/providers.js`, keep `getDbState()` only as fallback when `/api/bootstrap` fails in development. Production should render an error state instead of silently using stale browser data.

- [ ] **Step 3: Upload page posts to backend**

Change `handleSubmit` in `app/upload/page.js` so it calls `api.createTree(payload)`, then redirects to the created tree if approved or to the owner garden if pending moderation.

---

### Task 6: Add Image Upload Backend

**Files:**
- Create: `app/api/uploads/sign/route.js`
- Create: `lib/server/storage.js`
- Modify: `app/upload/page.js`

- [ ] **Step 1: Add storage interface**

Create `lib/server/storage.js`:

```js
export async function createUploadTarget({ fileName, contentType }) {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return {
    uploadUrl: `/api/uploads/mock/${Date.now()}-${safeName}`,
    publicUrl: `/uploads/${Date.now()}-${safeName}`,
    contentType,
  };
}
```

- [ ] **Step 2: Add signing endpoint**

Create `app/api/uploads/sign/route.js`:

```js
import { ok, fail } from "../../../../lib/server/errors";
import { createUploadTarget } from "../../../../lib/server/storage";

export async function POST(request) {
  const body = await request.json();

  if (!body.fileName || !body.contentType?.startsWith("image/")) {
    return fail(400, "VALIDATION_ERROR", "Only image uploads are allowed.");
  }

  const target = await createUploadTarget(body);
  return ok(target);
}
```

- [ ] **Step 3: Replace mock image selection**

Convert `simulateImageUpload` in `app/upload/page.js` into a real file input flow that requests signed upload targets and stores returned public URLs in `selectedImages`.

---

### Task 7: Add Moderation Workflow

**Files:**
- Create: `app/api/admin/moderation/trees/route.js`
- Create: `app/api/admin/moderation/trees/[id]/route.js`
- Create: `app/admin/moderation/page.js`
- Modify: `app/settings/page.js`

- [ ] **Step 1: List pending trees**

Create `app/api/admin/moderation/trees/route.js`:

```js
import { ok } from "../../../../lib/server/errors";
import { prisma } from "../../../../lib/server/db";

export async function GET() {
  const trees = await prisma.tree.findMany({
    where: { approved: false },
    include: { owner: true, images: true },
    orderBy: { createdAt: "desc" },
  });

  return ok(trees);
}
```

- [ ] **Step 2: Approve or reject**

Create `app/api/admin/moderation/trees/[id]/route.js`:

```js
import { ok, fail } from "../../../../../lib/server/errors";
import { prisma } from "../../../../../lib/server/db";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  if (body.action !== "approve" && body.action !== "reject") {
    return fail(400, "VALIDATION_ERROR", "Action must be approve or reject.");
  }

  if (body.action === "reject") {
    await prisma.tree.delete({ where: { id } });
    return ok({ id, deleted: true });
  }

  const tree = await prisma.tree.update({
    where: { id },
    data: { approved: true },
  });

  return ok(tree);
}
```

---

### Task 8: Verification And Release Readiness

**Files:**
- Modify: `package.json`
- Create: `tests/api/*.test.js`
- Create: `tests/e2e/core-flows.spec.js`

- [ ] **Step 1: Add scripts**

Update `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 2: Run checks**

Run:

```bash
npm run lint
npm run test
npm run build
```

Expected:
- lint passes
- API tests pass
- production build succeeds

- [ ] **Step 3: Manual smoke flow**

Run:

```bash
npm run dev
```

Verify:
- Home loads trees from `/api/trees`
- Upload creates a tree through `/api/trees`
- Moderation setting changes backend state
- Tree detail loads from `/api/trees/[id]`
- Artisan guestbook persists after reload

---

## Execution Order

1. Freeze contracts and dedupe frontend helpers.
2. Add database schema and seed.
3. Add public read APIs.
4. Add auth and protected mutations.
5. Migrate frontend reads from provider/localStorage to API.
6. Migrate upload and guestbook writes.
7. Add real image storage.
8. Add moderation dashboard.
9. Add tests, build verification, and deployment config.

## Key Product Decisions To Confirm Before Coding

1. Database hosting: Supabase Postgres, Neon, Railway, or self-hosted PostgreSQL.
2. Auth provider: Auth.js, Supabase Auth, Clerk, or Better Auth.
3. Image storage: Supabase Storage, S3/R2, or local-only development storage.
4. Moderation behavior: newly uploaded trees visible immediately or hidden until approved.
5. Roles: only admin/artisan/member, or add moderator separately.

## Risks

- Current FE assumes data is instantly available from context; API migration needs loading/error states.
- Current localStorage schema uses Vietnamese status strings; backend enum mapping must be handled carefully.
- Auth must be enforced in API/DAL, not only by hiding UI controls.
- Image upload should validate MIME type, file size, and ownership before accepting URLs.
- `.codegraph/` was created for repo analysis and should be ignored or removed before commits if the team does not want local indexes in git.
