import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

import { db, mongoClient } from "@/lib/db";

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client: mongoClient,
    }),
    user: {
        additionalFields: {
            role: {
                type: ["admin", "user", "vendor"],
                // The sign-up form sends "user" or "vendor", so the field has
                // to be writable by the client. `databaseHooks` below keeps
                // anyone from registering as an admin.
                input: true,
                defaultValue: "user",
            },
            premium: {
                // Written server-side only (Stripe activation / cancellation),
                // so clients can never grant themselves Premium.
                type: "boolean",
                input: false,
                defaultValue: false,
            },
            premiumCancelAt: {
                // When a Premium cancellation was requested. Premium stays
                // active until this date, then the account falls back to Free.
                type: "date",
                input: false,
                required: false,
            },
        }
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const role = user.role === "vendor" ? "vendor" : "user";

                    return { data: { ...user, role } };
                },
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,}
        }
});
