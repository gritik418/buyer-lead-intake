# Buyer Lead Intake App

A lightweight platform to **capture, manage, and track buyer leads**. Key features include **form validation**, **search and filter capabilities**, **CSV import/export**, and **accessibility-focused design**. Built with **Next.js (App Router)**, **TypeScript**, **Prisma**, and **Zod** for robust client- and server-side validation.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Database & Migrations](#database--migrations)
- [Usage](#usage)
- [Design Notes](#design-notes)
- [What's Done vs Skipped](#whats-done-vs-skipped)
- [Screenshots](#screenshots)

---

## Features

- Create, view, edit, and delete buyer leads
- Form validation on both client and server using **Zod**
- **Search** and **filter** leads by city, property type, status, and timeline
- **CSV import/export** for leads with transactional validation
- **Status quick-actions** and **tag chips with typeahead**
- **Accessibility**: labels, keyboard focus, error announcements
- **Error boundary** for catching runtime errors
- SSR-based pagination with sorting and URL-synced filters
- ownership enforcement: Users can edit/delete only their own leads
- **Admin role:** can edit and delete any record

---

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, React
- **Backend/DB:** Prisma, Supabase
- **Validation:** Zod
- **State Management:** Redux Toolkit (for user/session)
- **Authentication:** Supabase magic link
- **Other:** TailwindCSS, React Icons, use-debounce, CSV parser

---

## Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/gritik418/buyer-lead-intake.git
cd buyer-lead-intake
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Set environment variables in .env:

```bash
# PostgreSQL connection string (required)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Prisma direct URL (required)
DIRECT_URL=postgresql://user:password@localhost:5432/dbname

# Supabase credentials (required)
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_KEY=<your-supabase-key>

# Base URL of the app (required)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Admin email for initial seed user (required)
ADMIN_EMAIL=<admin-email>
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Run seed:

```bash
npx prisma db seed
```

6. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 to view the app.

---

## Database & Migrations

The main table is buyers with fields:

id, fullName, email, phone, city, propertyType, bhk, purpose, budgetMin, budgetMax, timeline, source, status, notes, tags, ownerId, updatedAt

buyer_history table stores changes:

id, buyerId, changedBy, changedAt, diff

Migrations managed via Prisma.

---

## Usage

/buyers/new → Create a new lead

/buyers → List leads with search, filters, and CSV import/export

/buyers/[id] → View and edit a lead\

CSV import validates all rows; only valid rows are saved

---

## Design Notes

Validation: Zod schemas used both on client and server

SSR vs Client: Lists and filters use server-side pagination; forms use client-side validation

Ownership Enforcement: Users can only edit/delete leads they own

---

## What's Done vs Skipped

**Done:**

- CRUD operations
- Filters, search, and pagination
- CSV import/export
- Tag chips & status quick actions
- Accessibility basics
- Error boundary
- Unit test for buyer schema
- Simple rate limiter on create/update
- **Admin role:** can edit and delete any record

**Skipped / Optional:**

- File attachments
- Optimistic updates

---

## Screenshots

### Home Screen

![Home Screen](/public/screenshots/home_screen.png)

### Login Screen

![Login Screen](/public/screenshots/login_screen.png)

### Buyers List Screen

![Buyers List Screen](/public/screenshots/buyers_list_screen.png)

### Create New Lead Screen

![Create New Lead](/public/screenshots/create_new_lead_screen.png)

### CSV Import Modal

![CSV Import Modal](/public/screenshots/import_csv_modal.png)

### CSV Error Info

![CSV Error Info](/public/screenshots/csv_error_info_with_row_info.png)

### Change History Record (Old vs New)

![Change History Comparison](/public/screenshots/change_history_record_with_old_new_comparison.png)
