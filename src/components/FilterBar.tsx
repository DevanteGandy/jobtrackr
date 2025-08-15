"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const STATUSES = ["APPLIED","INTERVIEW","OFFER","REJECTED","GHOSTED"] as const;

export default function FilterBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [status, setStatus] = useState<string>(sp.get("status") ?? "");
  const [q, setQ] = useState<string>(sp.get("q") ?? "");

  // keep local state in sync when user navigates
  useEffect(() => {
    setStatus(sp.get("status") ?? "");
    setQ(sp.get("q") ?? "");
  }, [sp]);

  function apply(next?: Partial<{ status: string; q: string }>) {
    const params = new URLSearchParams(sp.toString());
    const s = next?.status ?? status;
    const query = next?.q ?? q;

    if (s) params.set("status", s); else params.delete("status");
    if (query) params.set("q", query); else params.delete("q");

    router.push(`/?${params.toString()}`);
    // router.refresh(); // not strictly needed since URL changes
  }

  return (
    <div className="flex gap-3 mb-4">
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          apply({ status: e.target.value });
        }}
        className="border rounded p-2"
      >
        <option value="">All Statuses</option>
        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") apply(); }}
        placeholder="Search company or role..."
        className="border rounded p-2 flex-1"
      />

      <button
        onClick={() => apply()}
        className="bg-blue-600 text-white px-4 rounded"
      >
        Filter
      </button>
      
    </div>
  );
}
