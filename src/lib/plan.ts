import "server-only";

import { ObjectId } from "mongodb";

import { db } from "@/lib/db";

type PremiumState = {
  premium?: boolean | null;
};

type PremiumUserDoc = PremiumState & {
  _id: ObjectId;
};

const USERS = db.collection<PremiumUserDoc>("user");

/**
 * Premium is active whenever the flag is on. A missing field means a plain
 * Free account.
 */
export function isPremiumActive(user: PremiumState | null | undefined) {
  return Boolean(user?.premium);
}

function toObjectId(userId: string) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user id.");
  }

  return new ObjectId(userId);
}

/**
 * Marks the account as Premium.
 */
export async function activatePremium(userId: string) {
  const _id = toObjectId(userId);

  const result = await USERS.updateOne({ _id }, { $set: { premium: true } });

  if (result.matchedCount === 0) {
    throw new Error("User not found.");
  }
}
