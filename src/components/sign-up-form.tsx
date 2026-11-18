"use client";

import { authClient } from "@/lib/auth-client";
import {
  Check,
  Circle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Lock,
  Mail,
  Store,
  User,
  UserPlus,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";

const FIELD_CLASS =
  "w-full rounded-xl border border-outline-variant/60 bg-surface-container-low py-space-sm text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow";
const LABEL_CLASS =
  "block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold";

const ROLES = [
  { value: "user", label: "User", icon: User },
  { value: "vendor", label: "Vendor", icon: Store },
];

const PASSWORD_RULES = [
  {
    id: "length",
    short: "8+ characters",
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    id: "uppercase",
    short: "an uppercase letter",
    label: "One uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "number",
    short: "a number",
    label: "One number",
    test: (value: string) => /[0-9]/.test(value),
  },
  {
    id: "special",
    short: "a special character",
    label: "One special character",
    test: (value: string) => /[^A-Za-z0-9\s]/.test(value),
  },
];

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    if (userData.password !== userData.confirmPassword) {
      setError("Those passwords don't match. Please try again.");

      return;
    }
    const { data, error } = await authClient.signUp.email({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      image: userData.image,
      role: userData.role,
      callbackURL: "/",
    });

    if (data) {
      setError("");
      toast.success("Successfully signed up", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      redirect("/");
    }

    if (error) {
      setError(error?.message as string);
      return;
    }
  };

  return (
    <form className="space-y-space-md" onSubmit={handleSubmit}>
      <div className="space-y-space-xs">
        <label className={LABEL_CLASS} htmlFor="name">
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
            className={`${FIELD_CLASS} pl-11 pr-space-md`}
            id="name"
            name="name"
            placeholder="Elena Lorenzo"
            type="text"
          />
        </div>
      </div>

      <div className="space-y-space-xs">
        <label className={LABEL_CLASS} htmlFor="email">
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
            className={`${FIELD_CLASS} pl-11 pr-space-md`}
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
        </div>
      </div>

      <div className="space-y-space-xs">
        <label className={LABEL_CLASS} htmlFor="image">
          Image URL
        </label>
        <div className="relative">
          <ImageIcon
            className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline"
            size={18}
          />
          <input
            autoComplete="photo"
            className={`${FIELD_CLASS} pl-11 pr-space-md`}
            id="image"
            name="image"
            placeholder="https://example.com/your-photo.jpg"
            type="url"
          />
        </div>
      </div>

      <fieldset>
        <legend className={`${LABEL_CLASS} mb-space-xs`}>Role</legend>
        <div className="grid grid-cols-2 gap-space-sm">
          {ROLES.map((role) => (
            <label
              key={role.value}
              className="flex cursor-pointer items-center gap-space-xs rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors has-checked:border-primary-container has-checked:bg-primary-fixed/40 has-checked:text-charcoal-dark"
            >
              <input
                defaultChecked={role.value === "user"}
                className="h-4 w-4 shrink-0 accent-primary-container"
                name="role"
                type="radio"
                value={role.value}
              />
              <role.icon size={16} />
              {role.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <div className="space-y-space-xs">
          <label className={LABEL_CLASS} htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline"
              size={18}
            />
            <input
              required
              aria-describedby="password-requirements"
              minLength={8}
              autoComplete="new-password"
              className={`${FIELD_CLASS} pl-11 pr-12`}
              id="password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Min. 8 characters"
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-space-md top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-space-xs">
          <label className={LABEL_CLASS} htmlFor="confirmPassword">
            Confirm password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline"
              size={18}
            />
            <input
              required
              minLength={8}
              autoComplete="new-password"
              className={`${FIELD_CLASS} pl-11 pr-space-md`}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Repeat password"
              type={showPassword ? "text" : "password"}
            />
          </div>
        </div>
      </div>

      <ul
        className="grid grid-cols-1 gap-x-space-md gap-y-space-xs sm:grid-cols-2"
        id="password-requirements"
      >
        {PASSWORD_RULES.map((rule) => {
          const met = rule.test(password);

          return (
            <li
              key={rule.id}
              className={`flex items-center gap-space-xs font-label-sm text-label-sm ${
                met ? "text-tertiary" : "text-outline"
              }`}
            >
              {met ? <Check size={13} /> : <Circle size={13} />}
              {rule.label}
            </li>
          );
        })}
      </ul>

      <label className="flex items-start gap-space-sm pt-space-xs font-body-md text-body-md text-on-surface-variant">
        <input
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-outline-variant accent-primary-container"
          name="terms"
          type="checkbox"
        />
        <span>
          I agree to the{" "}
          <a
            className="font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors"
            href="#"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            className="font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {error ? (
        <p
          aria-live="polite"
          className="rounded-xl bg-error-container px-space-md py-space-sm font-body-md text-body-md text-on-error-container"
        >
          {error}
        </p>
      ) : null}

      <button
        className="inline-flex w-full items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-lg py-space-md font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5"
        type="submit"
      >
        <UserPlus size={18} />
        <span>Create my account</span>
      </button>
    </form>
  );
}
