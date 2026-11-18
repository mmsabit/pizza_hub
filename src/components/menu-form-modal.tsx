"use client";

import {
  CheckCircle2,
  ImagePlus,
  UtensilsCrossed,
  X,
  XCircle,
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useId } from "react";
import { MENU_CATEGORIES } from "@/lib/menu";
import { Bounce, toast } from "react-toastify";

const FIELD_CLASS =
  "w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface placeholder:text-outline transition-shadow focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container";
const LABEL_CLASS =
  "block font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant";
const RADIO_CARD_CLASS =
  "flex cursor-pointer items-center gap-space-xs rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors has-checked:border-primary-container has-checked:bg-primary-fixed/40 has-checked:text-charcoal-dark";

type MenuFormModalProps = {
  onClose: () => void;
  userName: string;
  userImage: string;
  userId: string;
};

export function MenuFormModal({
  onClose,
  userName,
  userImage,
  userId,
}: MenuFormModalProps) {
  const fieldId = useId();

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const imageFile = data.get("imageFile");
    let imageUrl: string | null = null;

    if (imageFile instanceof File && imageFile.size > 0) {
      const uploadFormData = new FormData();
      uploadFormData.append("image", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Image upload failed");
      }

      imageUrl = result.imageUrl as string;
    }

    const menu = {
      name: String(data.get("name") ?? "").trim(),
      category: String(data.get("category") ?? MENU_CATEGORIES[0]),
      price: Number(data.get("price")),
      description: String(data.get("description") ?? "").trim(),
      available: data.get("available") === "available",
      status: String(data.get("status") ?? ""),
      vendor: {
        id: String(data.get("vendorId") ?? ""),
        name: String(data.get("vendorName") ?? ""),
        image: String(data.get("vendorImage") ?? ""),
      },
      image: imageUrl,
    };

    if (!menu.name || Number.isNaN(menu.price)) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menu),
    });

    if (res.ok) {
      toast.success("Your menu added successfully wait for admin aproveal", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      onClose();
    } else {
      toast.error("Failed to create event. Please try again.", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    }
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
              Add new menu
            </h2>
            <p className="font-label-sm text-label-sm text-outline">
              The form data is logged to the console.
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
          {/* 1. Menu name */}
          <div className="space-y-space-xs">
            <label className={LABEL_CLASS} htmlFor={`${fieldId}-name`}>
              Menu name
            </label>
            <input
              required
              autoFocus
              className={FIELD_CLASS}
              id={`${fieldId}-name`}
              name="name"
              placeholder="Truffle Wild Mushroom"
              type="text"
            />
          </div>

          <div className="grid gap-space-md sm:grid-cols-2">
            {/* 2. Menu category */}
            <div className="space-y-space-xs">
              <label className={LABEL_CLASS} htmlFor={`${fieldId}-category`}>
                Menu category
              </label>
              <select
                className={FIELD_CLASS}
                defaultValue={MENU_CATEGORIES[0]}
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

            {/* 3. Price in BDT */}
            <div className="space-y-space-xs">
              <label className={LABEL_CLASS} htmlFor={`${fieldId}-price`}>
                Price (BDT)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 font-label-lg text-label-lg text-on-surface-variant">
                  ৳
                </span>
                <input
                  required
                  className={`${FIELD_CLASS} pl-9`}
                  id={`${fieldId}-price`}
                  min="0"
                  name="price"
                  placeholder="1200.00"
                  step="0.01"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* 4. Description */}
          <div className="space-y-space-xs">
            <label className={LABEL_CLASS} htmlFor={`${fieldId}-description`}>
              Description
            </label>
            <textarea
              className={FIELD_CLASS}
              id={`${fieldId}-description`}
              name="description"
              placeholder="Ingredients, crust and what makes it special."
              rows={3}
            />
          </div>

          {/* 5. Image file */}
          <div className="space-y-space-xs">
            <label className={LABEL_CLASS} htmlFor={`${fieldId}-image`}>
              Menu image
            </label>
            <label
              className="flex cursor-pointer flex-col items-center justify-center gap-space-xs rounded-xl border border-dashed border-outline-variant/60 bg-surface-container-low px-space-md py-space-lg text-center transition-colors hover:border-primary-container hover:bg-surface-container-low/70"
              htmlFor={`${fieldId}-image`}
            >
              <ImagePlus className="text-outline" size={22} />
              <span className="font-label-lg text-label-lg font-bold text-charcoal-dark">
                Choose an image
              </span>
              <span className="font-label-sm text-label-sm text-outline">
                PNG, JPG or WebP
              </span>
              <input
                accept="image/*"
                className="sr-only"
                id={`${fieldId}-image`}
                name="imageFile"
                type="file"
              />
            </label>
          </div>

          {/* 6. Availability radio */}
          <fieldset className="space-y-space-xs">
            <legend className={`${LABEL_CLASS} mb-space-xs`}>
              Availability
            </legend>
            <div className="grid grid-cols-2 gap-space-sm">
              <label className={RADIO_CARD_CLASS}>
                <input
                  defaultChecked
                  className="h-4 w-4 shrink-0 accent-primary-container"
                  name="available"
                  type="radio"
                  value="available"
                />
                <CheckCircle2 size={16} />
                Available
              </label>
              <label className={RADIO_CARD_CLASS}>
                <input
                  className="h-4 w-4 shrink-0 accent-primary-container"
                  name="available"
                  type="radio"
                  value="unavailable"
                />
                <XCircle size={16} />
                Unavailable
              </label>
            </div>
          </fieldset>

          
          <input name="status" type="hidden" value="pending" />
          <input name="vendorId" type="hidden" value={userId} />
          <input name="vendorName" type="hidden" value={userName} />
          <input name="vendorImage" type="hidden" value={userImage} />

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
              <UtensilsCrossed size={16} />
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
