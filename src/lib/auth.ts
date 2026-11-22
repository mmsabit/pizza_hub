import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

import { db, mongoClient } from "@/lib/db";

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client: mongoClient,
    }),
    user: {
        changeEmail: {
            enabled: true,
            updateEmailWithoutVerification: true,
        },
        additionalFields: {
            role: {
                type: ["admin", "user", "vendor"],
                input: true,
                defaultValue: "user",
            },
            premium: {
                type: "boolean",
                input: false,
                defaultValue: false,
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
