"use client";

import { Eye, EyeOff, Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import { useState } from "react";

const FIELD_CLASS =
  "w-full rounded-xl border border-outline-variant/60 bg-surface-container-low py-space-sm text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow";
const LABEL_CLASS =
  "block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="space-y-space-md"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const confirm = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

        if (password !== confirm) {
          setError("Those passwords don't match. Please try again.");
          setSubmitted(false);
          return;
        }

        setError("");
        setSubmitted(true);
      }}
    >
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <div className="space-y-space-xs">
          <label className={LABEL_CLASS} htmlFor="firstName">
            First name
          </label>
          <div className="relative">
            <User
              className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline"
              size={18}
            />
            <input
              required
              autoComplete="given-name"
              className={`${FIELD_CLASS} pl-11 pr-space-md`}
              id="firstName"
              name="firstName"
              placeholder="Elena"
              type="text"
            />
          </div>
        </div>

        <div className="space-y-space-xs">
          <label className={LABEL_CLASS} htmlFor="lastName">
            Last name
          </label>
          <div className="relative">
            <User
              className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline"
              size={18}
            />
            <input
              required
              autoComplete="family-name"
              className={`${FIELD_CLASS} pl-11 pr-space-md`}
              id="lastName"
              name="lastName"
              placeholder="Lorenzo"
              type="text"
            />
          </div>
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
        <label className={LABEL_CLASS} htmlFor="phone">
          Phone number
        </label>
        <div className="relative">
          <Phone
            className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline"
            size={18}
          />
          <input
            required
            autoComplete="tel"
            className={`${FIELD_CLASS} pl-11 pr-space-md`}
            id="phone"
            name="phone"
            placeholder="+1 (555) 010-2030"
            type="tel"
          />
        </div>
      </div>

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
              minLength={8}
              autoComplete="new-password"
              className={`${FIELD_CLASS} pl-11 pr-12`}
              id="password"
              name="password"
              placeholder="Min. 8 characters"
              type={showPassword ? "text" : "password"}
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

      <label className="flex items-start gap-space-sm pt-space-xs font-body-md text-body-md text-on-surface-variant">
        <input
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-outline-variant accent-primary-container"
          name="terms"
          type="checkbox"
        />
        <span>
          I agree to the{" "}
          <a className="font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors" href="#">
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

      {submitted ? (
        <p
          aria-live="polite"
          className="rounded-xl bg-secondary-fixed px-space-md py-space-sm font-body-md text-body-md text-on-secondary-fixed-variant"
        >
          Demo only — no authentication backend is connected yet.
        </p>
      ) : null}
    </form>
  );
}
