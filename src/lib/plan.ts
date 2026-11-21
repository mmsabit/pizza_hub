import "server-only";

import { ObjectId } from "mongodb";

import { db } from "@/lib/db";

type PremiumState = {
  premium?: boolean | null;
  premiumCancelAt?: Date | string | null;
};

type PremiumUserDoc = PremiumState & {
  _id: ObjectId;
};

const USERS = db.collection<PremiumUserDoc>("user");

function toDate(value: Date | string | null | undefined) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Premium is active when the flag is on and its scheduled cancellation date
 * (if any) has not passed yet. Missing fields mean a plain Free account.
 */
export function isPremiumActive(user: PremiumState | null | undefined) {
  if (!user?.premium) return false;

  const cancelAt = toDate(user.premiumCancelAt);

  return cancelAt === null || cancelAt.getTime() > Date.now();
}

function toObjectId(userId: string) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user id.");
  }

  return new ObjectId(userId);
}

/**
 * Marks the account as Premium and clears an old cancellation. A cancellation
 * scheduled *after* the payment stays in place, so revisiting an old checkout
 * success page cannot silently re-subscribe someone.
 */
export async function activatePremium(userId: string, paidAt: Date) {
  const _id = toObjectId(userId);
  const user = await USERS.findOne({ _id });

  if (!user) throw new Error("User not found.");

  const scheduledCancelAt = toDate(user.premiumCancelAt);

  if (scheduledCancelAt && scheduledCancelAt.getTime() > paidAt.getTime()) {
    return false;
  }

  await USERS.updateOne(
    { _id },
    { $set: { premium: true, premiumCancelAt: null } },
  );

  return true;
}
