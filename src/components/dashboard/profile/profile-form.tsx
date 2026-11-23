"use client";

import {
  ArrowRight,
  Camera,
  Crown,
  Loader2,
  Mail,
  Pencil,
  Save,
  User,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Bounce, toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";
import { roleLabel, type Role } from "@/lib/roles";

const FIELD_CLASS =
  "w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface placeholder:text-outline transition-shadow focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container disabled:cursor-not-allowed disabled:opacity-60";
const LABEL_CLASS =
  "block font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant";
const MAX_IMAGE_BYTES = 32 * 1024 * 1024;
const PLACEHOLDER_IMAGE = "/images/placeholder.png";
const TOAST_OPTIONS = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  transition: Bounce,
} as const;

type ProfilePlan = {
  active: boolean;
};

type ProfileUser = {
  name: string;
  email: string;
  image: string;
};

type ProfileFormProps = {
  role: Role;
  user: ProfileUser;
  plan: ProfilePlan | null;
};

export function ProfileForm({ role, user, plan }: ProfileFormProps) {
  const uid = useId();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Revoke the blob URL when the selection changes or the form unmounts.
  useEffect(() => {
    if (!previewUrl) return;

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG or WebP).");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image must be smaller than 32 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEditing = () => {
    setError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setName(user.name);
    setEmail(user.email);
    clearSelectedImage();
    setError("");
    setIsEditing(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    const nextName = name.trim();
    const nextEmail = email.trim().toLowerCase();

    if (!nextName) {
      setError("Enter your name.");
      return;
    }

    if (!nextEmail) {
      setError("Enter your email address.");
      return;
    }

    const nameChanged = nextName !== user.name;
    const emailChanged = nextEmail !== user.email.toLowerCase();
    const imageChanged = imageFile !== null;

    if (!nameChanged && !emailChanged && !imageChanged) {
      toast.info("Your profile is already up to date.", TOAST_OPTIONS);
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      let nextImage = user.image;

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });
        const uploadResult = (await uploadResponse.json()) as {
          imageUrl?: string;
          error?: string;
        };

        if (!uploadResponse.ok || typeof uploadResult.imageUrl !== "string") {
          throw new Error(uploadResult.error || "Profile photo upload failed.");
        }

        nextImage = uploadResult.imageUrl;
      }

      const imageChangedAfterUpload = nextImage !== user.image;
      let profileSaved = false;

      if (nameChanged || imageChangedAfterUpload) {
        const { error: updateError } = await authClient.updateUser({
          ...(nameChanged ? { name: nextName } : {}),
          ...(imageChangedAfterUpload ? { image: nextImage } : {}),
        });

        if (updateError) {
          throw new Error(
            updateError.message || "Could not update your profile.",
          );
        }

        profileSaved = true;
      }

      if (emailChanged) {
        const { error: emailError } = await authClient.changeEmail({
          newEmail: nextEmail,
          callbackURL: "/",
        });

        if (emailError) {
          if (profileSaved) {
            toast.success("Profile details saved.", TOAST_OPTIONS);
            router.refresh();
          }

          throw new Error(
            emailError.message || "Could not update your email address.",
          );
        }
      }

      // Refresh the client session atom so the header and sidebar pick up the
      // new name/photo without a full page reload.
      try {
        await authClient.getSession({ query: { disableCookieCache: true } });
      } catch {
        // The save already succeeded; a stale header is not worth an error.
      }

      setImageFile(null);
      setPreviewUrl(nextImage || null);
      setIsEditing(false);
      toast.success("Profile updated successfully.", TOAST_OPTIONS);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const avatarSrc = previewUrl || user.image || PLACEHOLDER_IMAGE;
  const isBlobPreview = previewUrl?.startsWith("blob:") ?? false;

  return (
    <div className="mx-auto max-w-5xl space-y-space-lg">
      <Reveal as="header">
        <p className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-crust-gold" />
          Account settings
        </p>
        <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
          Your profile
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Keep the name, photo and email address on your PizzaHub account up to
          date.
        </p>
      </Reveal>

      <Stagger
        className="grid gap-space-lg lg:grid-cols-[18rem_minmax(0,1fr)]"
        stagger={0.12}
      >
        <StaggerItem as="aside" className="space-y-space-md" direction="right">
          <section className="rounded-3xl border border-surface-container-high bg-surface-container-lowest p-space-lg text-center shadow-sm">
            <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full bg-surface-container-low ring-4 ring-primary-fixed">
              <Image
                alt="Profile photo"
                className="object-cover"
                fill
                sizes="96px"
                src={avatarSrc}
                unoptimized={isBlobPreview}
              />
            </div>

            <p className="mt-space-md truncate font-title-md text-title-md text-charcoal-dark">
              {name.trim() || user.name || "PizzaHub member"}
            </p>
            <p className="truncate font-label-sm text-label-sm text-outline">
              {email.trim() || user.email}
            </p>

            <span className="mt-space-sm inline-flex items-center gap-1 rounded-full bg-primary-fixed px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
              <User size={12} />
              {roleLabel(role)}
            </span>
          </section>

          {plan ? <PlanCard plan={plan} /> : null}
        </StaggerItem>

        <StaggerItem
          as="section"
          className="rounded-3xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-sm"
          direction="left"
        >
          <div className="flex flex-wrap items-start justify-between gap-space-sm">
            <div>
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Profile details
              </h2>
              <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">
                This is how you appear on PizzaHub and how you sign in.
              </p>
            </div>

            {isEditing ? null : (
              <button
                className="inline-flex shrink-0 items-center justify-center gap-space-xs rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-md py-space-sm font-label-lg text-label-lg text-charcoal-dark transition-colors hover:border-primary-container hover:bg-primary-fixed/20"
                onClick={startEditing}
                type="button"
              >
                <Pencil size={16} />
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form
              className="mt-space-md space-y-space-md"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-space-md sm:grid-cols-2">
                <div className="space-y-space-xs">
                  <label className={LABEL_CLASS} htmlFor={`${uid}-name`}>
                    Name
                  </label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline"
                      size={18}
                    />
                    <input
                      required
                      autoComplete="name"
                      className={`${FIELD_CLASS} pl-11`}
                      id={`${uid}-name`}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Elena Lorenzo"
                      type="text"
                      value={name}
                    />
                  </div>
                </div>

                <div className="space-y-space-xs">
                  <label className={LABEL_CLASS} htmlFor={`${uid}-email`}>
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline"
                      size={18}
                    />
                    <input
                      required
                      autoComplete="email"
                      className={`${FIELD_CLASS} pl-11`}
                      id={`${uid}-email`}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      type="email"
                      value={email}
                    />
                  </div>
                  <p className="font-label-sm text-label-sm text-outline">
                    Changing this updates the email you sign in with.
                  </p>
                </div>
              </div>

              <div className="space-y-space-xs">
                <span className={LABEL_CLASS}>Profile photo</span>
                <div className="flex flex-wrap items-center gap-space-sm">
                  <label className="inline-flex cursor-pointer items-center gap-space-xs rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-md py-space-sm font-label-lg text-label-lg text-charcoal-dark transition-colors hover:border-primary-container hover:bg-primary-fixed/20">
                    <Camera size={16} />
                    Choose photo
                    <input
                      ref={fileInputRef}
                      accept="image/*"
                      className="sr-only"
                      id={`${uid}-image`}
                      onChange={handleImageChange}
                      type="file"
                    />
                  </label>

                  {imageFile ? (
                    <button
                      className="inline-flex items-center gap-1.5 font-label-sm text-label-sm font-bold text-primary transition-colors hover:text-primary-container"
                      onClick={clearSelectedImage}
                      type="button"
                    >
                      <X size={14} />
                      Remove
                    </button>
                  ) : null}
                </div>
                <p className="font-label-sm text-label-sm text-outline">
                  PNG, JPG or WebP · up to 32 MB.
                  {user.image ? " Leave empty to keep your current photo." : ""}
                </p>
              </div>

              {error ? (
                <p
                  aria-live="polite"
                  className="rounded-xl bg-error-container px-space-md py-space-sm font-body-md text-body-md text-on-error-container"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-space-sm border-t border-surface-container-high pt-space-md">
                <button
                  className="inline-flex items-center justify-center gap-space-xs rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-lg py-space-md font-label-lg text-label-lg text-charcoal-dark transition-colors hover:border-primary-container hover:bg-primary-fixed/20 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSaving}
                  onClick={cancelEditing}
                  type="button"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  className="inline-flex items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-lg py-space-md font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-primary-container"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <dl className="mt-space-md space-y-space-sm">
              <div className="rounded-xl border border-surface-container-high bg-surface-container-low px-space-md py-space-sm">
                <dt className={LABEL_CLASS}>Name</dt>
                <dd className="mt-space-xs flex items-center gap-space-xs font-body-md text-body-md text-charcoal-dark">
                  <User className="shrink-0 text-outline" size={16} />
                  <span className="truncate">
                    {name.trim() || user.name || "Not set"}
                  </span>
                </dd>
              </div>

              <div className="rounded-xl border border-surface-container-high bg-surface-container-low px-space-md py-space-sm">
                <dt className={LABEL_CLASS}>Email address</dt>
                <dd className="mt-space-xs flex items-center gap-space-xs font-body-md text-body-md text-charcoal-dark">
                  <Mail className="shrink-0 text-outline" size={16} />
                  <span className="truncate">
                    {email.trim() || user.email}
                  </span>
                </dd>
              </div>

              <div className="flex items-center justify-between gap-space-sm rounded-xl border border-surface-container-high bg-surface-container-low px-space-md py-space-sm">
                <div className="min-w-0">
                  <dt className={LABEL_CLASS}>Profile photo</dt>
                  <dd className="mt-space-xs font-body-md text-body-md text-on-surface-variant">
                    {user.image
                      ? "Custom photo"
                      : "Using the default placeholder"}
                  </dd>
                </div>
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-container-high">
                  <Image
                    alt="Current profile photo"
                    className="object-cover"
                    fill
                    sizes="48px"
                    src={avatarSrc}
                    unoptimized={isBlobPreview}
                  />
                </div>
              </div>
            </dl>
          )}
        </StaggerItem>
      </Stagger>
    </div>
  );
}

function PlanCard({ plan }: { plan: ProfilePlan }) {
  return (
    <section className="rounded-3xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="flex items-start justify-between gap-space-sm">
        <div>
          <p className={LABEL_CLASS}>Active plan</p>
          <p className="mt-space-xs font-title-md text-title-md text-charcoal-dark">
            {plan.active ? "Premium" : "Free"}
          </p>
        </div>
        <span
          className={
            plan.active
              ? "inline-flex shrink-0 items-center gap-1 rounded-full bg-crust-gold/20 px-space-sm py-space-xs font-label-sm text-label-sm font-bold text-secondary"
              : "inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm font-bold text-on-surface-variant"
          }
        >
          {plan.active ? <Crown size={12} /> : <Wallet size={12} />}
          {plan.active ? "Premium" : "Free"}
        </span>
      </div>

      <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">
        {plan.active
          ? "Premium renews monthly through Stripe."
          : "You're on the Free plan. Upgrade for a Premium badge and featured placement."}
      </p>

      <Link
        className="mt-space-md inline-flex items-center gap-space-xs font-label-lg text-label-lg font-bold text-primary transition-colors hover:text-primary-container"
        href="/vendor/dashboard/plan"
      >
        Manage plan
        <ArrowRight size={14} />
      </Link>
    </section>
  );
}
