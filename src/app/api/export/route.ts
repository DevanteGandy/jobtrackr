// src/app/api/export/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;

  const valid = ["APPLIED","INTERVIEW","OFFER","REJECTED","GHOSTED"];
  const where: any = {};
  if (status && valid.includes(status)) where.status = status;
  if (q && q.trim()) {
    where.OR = [
      { company: { contains: q } },
      { role: { contains: q } },
    ];
  }

  const apps = await prisma.application.findMany({
    where,
    orderBy: { appliedAt: "desc" },
  });

  const header = [
    "company","role","status","appliedAt","location","source",
    "salaryMin","salaryMax","url","notes",
  ];

  const rows = apps.map(a => [
    a.company,
    a.role,
    a.status,
    a.appliedAt ? a.appliedAt.toISOString() : "",
    a.location ?? "",
    a.source ?? "",
    a.salaryMin?.toString() ?? "",
    a.salaryMax?.toString() ?? "",
    a.url ?? "",
    (a.notes ?? "").replace(/\n/g, " "),
  ]);

  const escape = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [header, ...rows].map(r => r.map(escape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications.csv"`,
    },
  });
}
