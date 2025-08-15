"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
});

export async function createApplication(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const data = createSchema.parse(raw);

  await prisma.application.create({
    data: {
      company: data.company,
      role: data.role,
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
  const status = String(formData.get("status") || "");
  if (!id || !status) return;

  await prisma.application.update({
    where: { id },
    data: { status: status as any },
  });

  revalidatePath("/");
}
