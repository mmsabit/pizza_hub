import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Store,
  Tag,
  XCircle,
} from "lucide-react";
import type { PizzaType } from "@/app/type/type";
import MenuEdit from "./_comp/menuedit";
import MenuDelete from "./_comp/menudelete";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import MenuStatusEdit from "./_comp/menustatusedit";
import OrderForm from "./_comp/orderform";

const PLACEHOLDER = "/images/placeholder.png";



const MenuDetailespage = async ({
  params,
}: {
  params: Promise<{ menuid: string }>;
}) => {
  const { menuid } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect(`/sign-in?redirect=/menu/${menuid}`);
  }

  let menu: PizzaType | null = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${menuid}`);
    if (res.ok) {
      menu = await res.json();
    }
  } catch (error) {
    console.error("Failed to load menu item:", error);
  }

  if (!menu?._id) {
    notFound();
  }

  const vendorName = menu.vendor?.name ?? "PizzaHub kitchen";
  const vendorImage = menu.vendor?.image || PLACEHOLDER;
  const imageSrc = menu.image || PLACEHOLDER;

  const numericPrice = Number(menu.price);
  const priceLabel = Number.isFinite(numericPrice)
    ? numericPrice.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })
    : String(menu.price);

  const user = session?.user;
  const userData = user?.id ? { id: user.id, name: user.name ?? "" } : null;
  const isVendorOwner =
    user?.role === "vendor" && user.id === menu.vendor?.id;
  const isAdmin = user?.role === "admin";
  const isOrderable = menu.status === "approved" && menu.available;

  return (
    <section className="relative w-full overflow-hidden bg-dough-surface">
      <div className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-secondary-container/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-125 w-125 rounded-full bg-primary-container/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-margin py-space-xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-space-lg flex flex-wrap items-center gap-space-xs font-label-md text-label-md text-on-surface-variant"
        >
          <Link className="transition-colors hover:text-primary" href="/">
            Home
          </Link>
          <span className="text-outline-variant">/</span>
          <Link className="transition-colors hover:text-primary" href="/menu">
            Menu
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="font-bold text-charcoal-dark">{menu.name}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-space-xl lg:grid-cols-12">
          {/* Image */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2.5rem] bg-linear-to-tr from-secondary-container/30 via-transparent to-primary-container/25 blur-xl" />

              <div className="relative aspect-square w-full overflow-hidden rounded-4xl border border-surface-container-high bg-dough-canvas shadow-2xl">
                <Image
                  alt={`${menu.name} — ${menu.category} by ${vendorName}`}
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 560px, 92vw"
                  src={imageSrc}
                />

                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-space-sm p-space-md">
                  <span className="inline-flex items-center gap-space-xs rounded-full bg-dough-canvas/95 px-space-md py-space-xs font-label-md text-label-md font-bold uppercase tracking-widest text-primary shadow-sm backdrop-blur">
                    <Tag size={14} />
                    {menu.category}
                  </span>

                  <span
                    className={`inline-flex items-center gap-space-xs rounded-full px-space-md py-space-xs font-label-md text-label-md font-bold uppercase tracking-widest shadow-sm backdrop-blur ${
                      menu.available
                        ? "bg-basil-fresh/90 text-white"
                        : "bg-charcoal-dark/90 text-surface-container-lowest"
                    }`}
                  >
                    {menu.available ? "Available" : "Sold Out"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-space-lg lg:col-span-6">
            

            <div className="space-y-space-sm">
              <h1 className="font-headline-lg text-headline-lg-mobile font-extrabold uppercase tracking-tight text-charcoal-dark sm:text-headline-lg">
                {menu.name}
              </h1>
              <p className="max-w-xl font-body-lg text-body-lg text-on-surface-variant">
                {menu.description ||
                  "A handcrafted PizzaHub creation, baked to order and served hot from the oven."}
              </p>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-end justify-between gap-space-md rounded-3xl border border-surface-container-high bg-dough-canvas p-space-lg shadow-sm">
              <div>
                <span className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-outline">
                  Price
                </span>
                <p className="font-headline-lg text-4xl font-extrabold leading-tight text-primary">
                  <span className="mr-1 align-top text-2xl">৳</span>
                  {priceLabel}
                </p>
              </div>

              <span className="mb-1 inline-flex items-center gap-space-xs rounded-full bg-surface-container-low px-space-md py-space-xs font-label-lg text-label-lg text-on-surface-variant">
                <Tag size={16} />
                BDT
              </span>
            </div>

            {/* Availability & status */}
            <div className="grid gap-space-md sm:grid-cols-2">
              <div className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md">
                <span className="flex items-center gap-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-outline">
                  {menu.available ? (
                    <CheckCircle2 className="text-tertiary" size={14} />
                  ) : (
                    <XCircle className="text-error" size={14} />
                  )}
                  Availability
                </span>
                <p className="mt-space-xs font-title-md text-title-md text-charcoal-dark">
                  {menu.available ? "In stock right now" : "Currently unavailable"}
                </p>
              </div>

              
            </div>

            {/* Vendor */}
            <div className="flex items-center gap-space-md rounded-3xl border border-surface-container-high bg-dough-canvas p-space-md shadow-sm">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface-container-low ring-2 ring-primary-fixed">
                <Image
                  alt={vendorName}
                  className="object-cover"
                  fill
                  sizes="56px"
                  src={vendorImage}
                />
              </div>

              <div className="min-w-0">
                <span className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-outline">
                  Sold by
                </span>
                <p className="truncate font-title-md text-title-md text-charcoal-dark">
                  {vendorName}
                </p>
              </div>

              <span className="ml-auto hidden shrink-0 items-center gap-space-xs rounded-full bg-surface-container-low px-space-sm py-1 font-label-sm text-label-sm text-on-surface-variant sm:inline-flex">
                <BadgeCheck className="text-tertiary" size={14} />
                Verified kitchen
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-space-sm border-t border-surface-container-high pt-space-lg">
              {isVendorOwner ? (
                <>
                  <MenuDelete menu={menu} />
                  <MenuEdit menu={menu} />
                </>
              ) : isAdmin ? (
                <>
                  <MenuDelete menu={menu} />
                  <MenuStatusEdit item={menu} />
                </>
              ) : isOrderable ? (
                userData ? <OrderForm menu={menu} user={userData} /> : null
              ) : (
                <p
                  className="font-label-lg text-label-lg text-on-surface-variant"
                  role="status"
                >
                  Menu not available
                </p>
              )}

              <Link
                className="inline-flex items-center justify-center gap-space-xs rounded-xl border border-outline-variant/60 px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                href="/menu"
              >
                <ArrowLeft size={16} />
                Back to menu
              </Link>
            </div>

            <div className="flex items-start gap-space-sm rounded-2xl bg-surface-container-low p-space-md">
              <Store className="mt-0.5 shrink-0 text-outline" size={18} />
              <p className="font-body-md text-body-md text-on-surface-variant">
                Every order is prepared fresh in the {vendorName} kitchen and
                dispatched in insulated packaging so it reaches you oven-warm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuDetailespage;
