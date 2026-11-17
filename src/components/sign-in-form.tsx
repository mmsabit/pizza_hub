"use client";

import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="space-y-space-md"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="space-y-space-xs">
        <label
          className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold"
          htmlFor="email"
        >
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
            className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low pl-11 pr-space-md py-space-sm text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow"
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
        </div>
      </div>

      <div className="space-y-space-xs">
        <label
          className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold"
          htmlFor="password"
        >
          Password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline"
            size={18}
          />
          <input
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low pl-11 pr-12 py-space-sm text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-shadow"
            id="password"
            name="password"
            placeholder="Enter your password"
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

      <div className="flex items-center justify-between gap-space-sm pt-space-xs">
        <label className="flex items-center gap-space-xs font-body-md text-body-md text-on-surface-variant">
          <input
            className="h-4 w-4 rounded border-outline-variant accent-primary-container"
            name="remember"
            type="checkbox"
          />
          Remember me
        </label>
        <a
          className="font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors"
          href="#"
        >
          Forgot password?
        </a>
      </div>

      <button
        className="inline-flex w-full items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-lg py-space-md font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5"
        type="submit"
      >
        <span>Sign in to PizzaHub</span>
        <ArrowRight size={18} />
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
