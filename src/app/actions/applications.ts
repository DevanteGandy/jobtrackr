"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Status } from "@prisma/client"; // ⬅️ add this

const createSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  url: z.string().url().optional().or(z.literal("")),
  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED", "GHOSTED"]).default("APPLIED"),
  location: z.string().optional(),
  source: z.string().optional(),
  salaryMin: z.coerce.number().int().optional(),
  salaryMax: z.coerce.number().int().optional(),
  notes: z.string().optional(),
  appliedAt: z.coerce.date().optional(),
});

export async function createApplication(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const data = createSchema.parse(raw);

  await prisma.application.create({
    data: {
      company: data.company,
      role: data.role,
      url: data.url || null,
      status: data.status as Status, // ⬅️ typed
      location: data.location || null,
      source: data.source || null,
      salaryMin: data.salaryMin ?? null,
      salaryMax: data.salaryMax ?? null,
      notes: data.notes || null,
      appliedAt: data.appliedAt ?? undefined,
    },
  });

  revalidatePath("/");
}

export async function deleteApplication(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.application.delete({ where: { id } });
  revalidatePath("/");
}

export async function updateStatus(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as Status; // ⬅️ typed
  if (!id || !status) return;

  await prisma.application.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/");
}
