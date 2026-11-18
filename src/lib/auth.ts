import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.DB_URI as string);
const db = client.db("pizza_hub");


export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
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
            }
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