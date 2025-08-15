import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import StatusSelect from "@/components/StatusSelect";
import { createApplication, deleteApplication } from "./actions/applications";
import Link from "next/link"; 
import type { Status, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const STATUSES = ["APPLIED","INTERVIEW","OFFER","REJECTED","GHOSTED"] as const;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  noStore();
  const params = await searchParams;

  const status = typeof params.status === "string" ? params.status : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;

  const where: Prisma.ApplicationWhereInput = {};
if (status && (STATUSES as readonly string[]).includes(status)) {
  where.status = status as Status;
}  if (q && q.trim()) where.OR = [{ company: { contains: q } }, { role: { contains: q } }];

  const apps = await prisma.application.findMany({ where, orderBy: { createdAt: "desc" } });

  const qs = new URLSearchParams();
  if (status) qs.set("status", status);
  if (q) qs.set("q", q);
 const exportHref = `/api/export${qs.toString() ? `?${qs.toString()}` : ""}`;
 
  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl p-6 lg:p-10 space-y-8">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">JobTrackr</h1>
          <a href={exportHref} className="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm hover:bg-slate-800">
            Export CSV
          </a>
        </header>

        {/* Create + Filters */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Create card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-300">New application</h2>
            <form action={createApplication} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input name="company" placeholder="Company" required
                     className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/10" />
              <input name="role" placeholder="Role" required
                     className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/10" />
              <input name="url" placeholder="Posting URL"
                     className="md:col-span-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/10" />
              <select name="status" defaultValue="APPLIED"
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/10">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input name="location" placeholder="Location"
                     className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/10" />
              <input name="source" placeholder="Source (LinkedIn, referral…)"
                     className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/10" />
              <input name="appliedAt" type="date"
                     className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/10" />
              <div className="md:col-span-2 flex justify-end">
                <button type="submit"
                        className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500">
                  Add
                </button>
              </div>
            </form>
          </div>

          {/* Filters card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-300">Filter</h2>
            <form method="get" className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select name="status" defaultValue={status ?? ""}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/10">
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="text" name="q" defaultValue={q ?? ""} placeholder="Search company or role…"
                     className="md:col-span-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/10" />
              <div className="md:col-span-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">{apps.length} application{apps.length !== 1 ? "s" : ""} found</span>
                <div className="flex gap-2">
                  {(status || q) && (
                     <Link href="/" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm hover:bg-slate-800">
                        Clear
                      </Link>                  )}
                  <button className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500">
                    Apply
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Table */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/70">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Company</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Applied</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(a => (
                  <tr key={a.id} className="border-t border-slate-800 hover:bg-slate-800/40">
                    <td className="px-4 py-3">{a.company}</td>
                    <td className="px-4 py-3">{a.role}</td>
                    <td className="px-4 py-3">
                      <div className="mb-1 inline-flex items-center rounded-full border border-slate-700 bg-slate-950 px-2.5 py-0.5 text-xs">
                        {a.status}
                      </div>
                      <div>
                        <StatusSelect id={a.id} current={a.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3">{a.appliedAt?.toISOString().slice(0,10)}</td>
                    <td className="px-4 py-3 text-right">
                      <form action={deleteApplication} className="inline">
                        <input type="hidden" name="id" value={a.id} />
                        <button className="rounded-md border border-rose-600 bg-rose-600 px-3 py-1.5 text-sm hover:bg-rose-500">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {apps.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-400" colSpan={5}>
                      No applications match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
