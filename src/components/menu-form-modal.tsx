"use client";

import { Save, UtensilsCrossed, X } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useId } from "react";
import { MENU_CATEGORIES, type MenuDraft, type MenuItem } from "@/lib/menu";

const FIELD_CLASS =
  "w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface placeholder:text-outline transition-shadow focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container";
const LABEL_CLASS =
  "block font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant";

type MenuFormModalProps = {
  item?: MenuItem | null;
  onClose: () => void;
  onSave: (draft: MenuDraft, id?: string) => void;
};

export function MenuFormModal({ item, onClose, onSave }: MenuFormModalProps) {
  const fieldId = useId();
  const isEdit = Boolean(item);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const price = Number(data.get("price"));

    if (!name || Number.isNaN(price)) return;

    onSave(
      {
        name,
        category: String(data.get("category") ?? MENU_CATEGORIES[0]),
        description: String(data.get("description") ?? "").trim(),
        price,
        image: String(data.get("image") ?? "").trim() || "/images/placeholder.png",
        available: data.get("available") === "on",
      },
      item?.id,
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-dark/60 p-space-sm backdrop-blur-sm sm:items-center sm:p-space-md"
      onClick={onClose}
    >
      <div
        aria-labelledby={`${fieldId}-title`}
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-surface-container-lowest p-space-lg shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-space-md">
          <div>
            <h2
              className="font-title-md text-title-md text-charcoal-dark"
              id={`${fieldId}-title`}
            >
              {isEdit ? "Edit menu" : "Add new menu"}
            </h2>
            <p className="font-label-sm text-label-sm text-outline">
              {isEdit
                ? "Changes go live on the storefront right away."
                : "New dishes go live on the storefront right away."}
            </p>
          </div>
          <button
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-container-high text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <form className="mt-space-md space-y-space-md" onSubmit={handleSubmit}>
          <div className="space-y-space-xs">
            <label className={LABEL_CLASS} htmlFor={`${fieldId}-name`}>
              Dish name
            </label>
            <input
              required
              autoFocus
              className={FIELD_CLASS}
              defaultValue={item?.name}
              id={`${fieldId}-name`}
              name="name"
              placeholder="Truffle Wild Mushroom"
              type="text"
            />
          </div>

          <div className="grid gap-space-md sm:grid-cols-2">
            <div className="space-y-space-xs">
              <label className={LABEL_CLASS} htmlFor={`${fieldId}-category`}>
                Category
              </label>
              <select
                className={FIELD_CLASS}
                defaultValue={item?.category ?? MENU_CATEGORIES[0]}
                id={`${fieldId}-category`}
                name="category"
              >
                {MENU_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-space-xs">
              <label className={LABEL_CLASS} htmlFor={`${fieldId}-price`}>
                Price (USD)
              </label>
              <input
                required
                className={FIELD_CLASS}
                defaultValue={item?.price}
                id={`${fieldId}-price`}
                min="0"
                name="price"
                placeholder="16.00"
                step="0.01"
                type="number"
              />
            </div>
          </div>

          <div className="space-y-space-xs">
            <label className={LABEL_CLASS} htmlFor={`${fieldId}-description`}>
              Description
            </label>
            <textarea
              className={FIELD_CLASS}
              defaultValue={item?.description}
              id={`${fieldId}-description`}
              name="description"
              placeholder="Ingredients, crust and what makes it special."
              rows={3}
            />
          </div>

          <div className="space-y-space-xs">
            <label className={LABEL_CLASS} htmlFor={`${fieldId}-image`}>
              Image URL
            </label>
            <input
              className={FIELD_CLASS}
              defaultValue={item?.image}
              id={`${fieldId}-image`}
              name="image"
              placeholder="https://example.com/dish.jpg"
              type="text"
            />
          </div>

          <label className="flex items-center gap-space-sm font-body-md text-body-md text-on-surface-variant">
            <input
              defaultChecked={item?.available ?? true}
              className="h-4 w-4 shrink-0 rounded border-outline-variant accent-primary-container"
              name="available"
              type="checkbox"
            />
            Available on the storefront today
          </label>

          <div className="flex flex-wrap justify-end gap-space-sm border-t border-surface-container-high pt-space-md">
            <button
              className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5"
              type="submit"
            >
              {isEdit ? <Save size={16} /> : <UtensilsCrossed size={16} />}
              {isEdit ? "Save changes" : "Add to menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
