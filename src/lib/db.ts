import { MongoClient } from "mongodb";

/**
 * One Mongo client per process. Next.js reloads modules on every edit in dev,
 * so caching it on `globalThis` avoids piling up connections.
 */
const globalForMongo = globalThis as typeof globalThis & {
  __pizzaHubMongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.__pizzaHubMongoClient ??
  new MongoClient(process.env.DB_URI as string);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.__pizzaHubMongoClient = mongoClient;
}

export const db = mongoClient.db("pizza_hub");
