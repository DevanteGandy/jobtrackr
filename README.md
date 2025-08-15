# JobTrackr

Track your job applications with a clean, modern UI. Built with **Next.js 14 (App Router)**, **Prisma**, **SQLite**, and **Tailwind CSS**.

---

## Features

- **Add applications** — company, role, URL, location, source, date, notes, salary.
- **Inline status updates** — Applied / Interview / Offer / Rejected / Ghosted.
- **Filters & search** — filter by status, search by company/role.
- **CSV export** — downloads the **current filtered view**.
- **Simple stack** — no external server; uses server actions + Prisma.

---

## Tech Stack

- Frontend: **Next.js 14**, **React**, **Tailwind CSS**
- DB/ORM: **SQLite** via **Prisma**
- Hosting: Works great on **Vercel** (or any Node host)

---

## Quick Start

1) **Clone**
git clone https://github.com/yourusername/jobtrackr.git
cd jobtrackr
2) **Install Deps**
pnpm install
3) **Env**
Create a .env file in the project root:
DATABASE_URL="file:./dev.db"
4) **DB migrate & generate**
pnpm prisma migrate dev --name init
pnpm prisma generate
5) **Run**
pnpm dev

<img width="1061" height="701" alt="C477CFD5-A069-41ED-8E1C-F8424AD83BDC" src="https://github.com/user-attachments/assets/3b70753c-1af0-43fd-8277-cc6bff30b41f" />
