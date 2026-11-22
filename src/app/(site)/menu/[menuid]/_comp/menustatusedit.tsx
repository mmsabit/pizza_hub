"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { PizzaType } from "@/app/type/type";
import { authClient } from "@/lib/auth-client";

type MenuStatus = PizzaType["status"];

const MenuStatusEdit = ({ item }: { item: PizzaType }) => {
  const router = useRouter();
  const [status, setStatus] = useState<MenuStatus>(item.status);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === item.status) return;
    const { data } = await authClient.token();
    const token = data?.token;
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/adminmenu/${item._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", authorization: `Bearer ${token}`, },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Could not update menu status.");
      }

      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update menu status.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      className="flex flex-wrap items-end gap-space-sm"
      onSubmit={handleSubmit}
    >
      <div className="space-y-space-xs">
        <label
          className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant"
          htmlFor="menu-status"
        >
          Menu status
        </label>
        <select
          className="rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-md py-space-sm font-label-lg text-label-lg text-on-surface"
          disabled={isSaving}
          id="menu-status"
          onChange={(event) => setStatus(event.target.value as MenuStatus)}
          value={status}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <button
        className="inline-flex items-center justify-center rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSaving || status === item.status}
        type="submit"
      >
        {isSaving ? "Saving..." : "Update status"}
      </button>
      {error ? (
        <p className="w-full text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
};

export default MenuStatusEdit;
