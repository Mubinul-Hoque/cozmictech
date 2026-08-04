# Vercel Deployment Guide for Cozmic Technology

This guide provides step-by-step instructions to deploy the Cozmic Technology Nuxt.js (Vue 3, TypeScript, Prisma) application directly from a GitHub repository to **Vercel**.

---

## 1. Prerequisites

Before deploying, ensure you have:
1. A **GitHub repository** containing this codebase.
2. A **Vercel account** connected to your GitHub account.
3. A **Cloud MySQL / MariaDB database** (e.g. PlanetScale, Supabase, Aiven, Railway, AWS RDS, TiDB Cloud) accessible over TCP with SSL.

---

## 2. Environment Variables Configuration

Set up the following Environment Variables in your **Vercel Project Settings** (`Settings -> Environment Variables`):

| Variable Name | Description | Example / Note |
|---|---|---|
| `DATABASE_URL` | Production MySQL connection string | `mysql://user:password@host:3306/dbname?sslaccept=strict` |
| `JWT_SECRET` | 64-character secret key for JWT session signing | Run `openssl rand -hex 32` to generate |
| `NODE_ENV` | Application environment mode | `production` |

---

## 3. Deployment Steps on Vercel

### Step 1: Import Project to Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Select your GitHub repository (`cozmictech`).

### Step 2: Project Build & Development Settings
- **Framework Preset**: `Nuxt.js` (automatically detected)
- **Build Command**: `npm run build` (runs `prisma generate && nuxt build`)
- **Install Command**: `npm install` (runs `postinstall` -> `prisma generate && nuxt prepare`)
- **Output Directory**: `.output`

### Step 3: Add Environment Variables
Expand the **Environment Variables** section and add `DATABASE_URL` and `JWT_SECRET`.

### Step 4: Click Deploy
Vercel will clone the repository, run `npm install`, execute `prisma generate`, and build the project using Nitro's Vercel serverless preset.

---

## 4. Production Database Migration

To apply your Prisma schema to your remote cloud database:

```bash
# Set your production database URL locally or in CI/CD pipeline
npx prisma db push
```

To populate initial administrative credentials or database seeds if needed:
```bash
npx tsx create_admin.ts
```

---

## 5. Summary of Built-in Deployment Enhancements

- **Prisma Client Generation**: Automatically executed during both `npm install` (`postinstall`) and `npm run build` so serverless functions have access to full Prisma client types.
- **Serverless File Upload Fallback**: `server/api/admin/upload.post.ts` automatically converts uploaded images to WebP and falls back to Data URLs if running in a read-only serverless environment.
- **Cache Optimization**: `vercel.json` and `nuxt.config.ts` configure 1-year immutable caching for static assets (`/_nuxt/` and `/assets/`).
- **Content Security Policy (CSP)**: Pre-configured via `nuxt-security` to allow dynamic script evaluation, inline styles, Google Fonts, and HTTPS image resources.
