"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateStatus } from "@/app/actions/applications";

export default function StatusSelect({ id, current }: { id: string; current: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", e.target.value);

    await updateStatus(formData); // call server action
    startTransition(() => {
      router.refresh(); // re-fetch server component data
    });
  }

  return (
    <select
      name="status"
      defaultValue={current}
      className="bg-gray-800 text-white border border-gray-600 rounded p-1"
      onChange={handleChange}
      disabled={isPending}
    >
      <option value="APPLIED">APPLIED</option>
      <option value="INTERVIEW">INTERVIEW</option>
      <option value="OFFER">OFFER</option>
      <option value="REJECTED">REJECTED</option>
      <option value="GHOSTED">GHOSTED</option>
    </select>
  );
}
