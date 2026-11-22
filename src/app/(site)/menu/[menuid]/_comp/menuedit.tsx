"use client";

import Image from "next/image";
import type { PizzaType } from "@/app/type/type";
import { MENU_CATEGORIES } from "@/lib/menu";
import {
  ImagePlus,
  CheckCircle2,
  XCircle,
  UtensilsCrossed,
  Pencil,
  X,
} from "lucide-react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";
import { authClient } from "@/lib/auth-client";

const FIELD_CLASS =
  "w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface placeholder:text-outline transition-shadow focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container";
const LABEL_CLASS =
  "block font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant";
const RADIO_CARD_CLASS =
  "flex cursor-pointer items-center gap-space-xs rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors has-checked:border-primary-container has-checked:bg-primary-fixed/40 has-checked:text-charcoal-dark";

const MenuEdit= ({
  menu,
}: {
  menu: PizzaType;
}) => {
  const router = useRouter();

  const handleEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const selectedImage = formData.get("imageFile");
      let imageUrl = menu.image;

      if (selectedImage instanceof File && selectedImage.size > 0) {
        const uploadData = new FormData();
        uploadData.append("image", selectedImage);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || typeof uploadResult.imageUrl !== "string") {
          throw new Error(uploadResult.error || "Image upload failed.");
        }

        imageUrl = uploadResult.imageUrl;
      }

      const price = Number(formData.get("price"));
      const name = String(formData.get("name") ?? "").trim();

      if (!name || !Number.isFinite(price)) {
        throw new Error("Enter a menu name and a valid price.");
      }

      const updatedMenu = {
        name,
        category: String(formData.get("category") ?? menu.category),
        price,
        description: String(formData.get("description") ?? "").trim(),
        available: formData.get("available") === "available",
        status: String(formData.get("status") ?? menu.status),
        vendor: {
          id: String(formData.get("vendorId") ?? menu.vendor.id),
          name: String(formData.get("vendorName") ?? menu.vendor.name),
          image: String(formData.get("vendorImage") ?? menu.vendor.image),
        },
        image: imageUrl,
      };
      const {data} = await authClient.token();
      const token = data?.token;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/menu/${menu._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedMenu),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update the menu. Please try again.");
      }

      toast.success(`${menu.name} successfully edited`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      (document.getElementById("editModal") as HTMLDialogElement)?.close();
      router.refresh();
    } catch (error) {
      console.error("Failed to update menu:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update the menu. Please try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        },
      );
    }
  };

  return (
    <>
      {/* Delete Button */}
      

      {/* Edit button */}

      <button
        className="inline-flex items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5"
        onClick={() =>
          (
            document.getElementById("editModal") as HTMLDialogElement
          )?.showModal()
        }
        type="button"
      >
        <Pencil size={16} />
        Edit
      </button>

      {/* Delete Modal */}

      

      {/* Edit modal */}

      <dialog id="editModal" className="modal">
        <div className="modal-box max-w-2xl">
          <form method="dialog">
            <button
              aria-label="Close dialog"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              type="submit"
            >
              <X size={16} />
            </button>
          </form>

          <h3 className="font-headline-sm text-headline-sm font-bold text-charcoal-dark">
            Edit menu
          </h3>
          <form className="mt-space-md space-y-space-md" onSubmit={handleEdit}>
            {/* 1. Menu name */}
            <div className="space-y-space-xs">
              <label className={LABEL_CLASS} htmlFor={`name`}>
                Menu name
              </label>
              <input
                required
                autoFocus
                className={FIELD_CLASS}
                defaultValue={menu.name}
                id="name"
                name="name"
                placeholder="Truffle Wild Mushroom"
                type="text"
              />
            </div>

            <div className="grid gap-space-md sm:grid-cols-2">
              {/* 2. Menu category */}
              <div className="space-y-space-xs">
                <label className={LABEL_CLASS} htmlFor={`category`}>
                  Menu category
                </label>
                <select
                  className={FIELD_CLASS}
                  defaultValue={menu.category}
                  id={`category`}
                  name="category"
                >
                  {!MENU_CATEGORIES.includes(menu.category) && (
                    <option value={menu.category}>{menu.category}</option>
                  )}
                  {MENU_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Price in BDT */}
              <div className="space-y-space-xs">
                <label className={LABEL_CLASS} htmlFor={`price`}>
                  Price (BDT)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 font-label-lg text-label-lg text-on-surface-variant">
                    ৳
                  </span>
                  <input
                    required
                    className={`${FIELD_CLASS} pl-9`}
                    defaultValue={menu.price}
                    id={`price`}
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
              <label className={LABEL_CLASS} htmlFor={`description`}>
                Description
              </label>
              <textarea
                className={FIELD_CLASS}
                defaultValue={menu.description}
                id={`description`}
                name="description"
                placeholder="Ingredients, crust and what makes it special."
                rows={3}
              />
            </div>

            {/* 5. Image file */}
            <div className="space-y-space-xs">
              <label className={LABEL_CLASS} htmlFor={`image`}>
                Menu image
              </label>
              <label
                className="flex cursor-pointer flex-col items-center justify-center gap-space-xs rounded-xl border border-dashed border-outline-variant/60 bg-surface-container-low px-space-md py-space-lg text-center transition-colors hover:border-primary-container hover:bg-surface-container-low/70"
                htmlFor={`image`}
              >
                <ImagePlus className="text-outline" size={22} />
                <span className="font-label-lg text-label-lg font-bold text-charcoal-dark">
                  Choose an image
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  {menu.image
                    ? "The current image will be kept unless you choose a new one."
                    : "PNG, JPG or WebP"}
                </span>
                <input
                  accept="image/*"
                  className="sr-only"
                  id={`image`}
                  name="imageFile"
                  type="file"
                />
              </label>
              {menu.image && (
                <Image
                  alt={`Current image for ${menu.name}`}
                  className="h-20 w-20 rounded-lg object-cover"
                  height={80}
                  src={menu.image}
                  width={80}
                />
              )}
            </div>

            {/* 6. Availability radio */}
            <fieldset className="space-y-space-xs">
              <legend className={`${LABEL_CLASS} mb-space-xs`}>
                Availability
              </legend>
              <div className="grid grid-cols-2 gap-space-sm">
                <label className={RADIO_CARD_CLASS}>
                  <input
                    defaultChecked={menu.available}
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
                    defaultChecked={!menu.available}
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
            <input name="status" type="hidden" value={menu.status} />
            <input name="vendorId" type="hidden" value={menu.vendor.id} />
            <input name="vendorName" type="hidden" value={menu.vendor.name} />
            <input name="vendorImage" type="hidden" value={menu.vendor.image} />
            <input name="image" type="hidden" value={menu.image} />

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() =>
                  (
                    document.getElementById("editModal") as HTMLDialogElement
                  )?.close()
                }
                type="button"
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                <UtensilsCrossed size={16} />
                Submit
              </button>
            </div>
          </form>
        </div>

        <form className="modal-backdrop" method="dialog">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default MenuEdit;
