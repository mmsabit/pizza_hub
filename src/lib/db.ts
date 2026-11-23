import { MongoClient } from "mongodb";

const uri = process.env.DB_URI;

if (!uri) {
  throw new Error("DB_URI environment variable is missing");
}

const globalForMongo = globalThis as typeof globalThis & {
  __pizzaHubMongoClient?: MongoClient;
  __pizzaHubMongoClientPromise?: Promise<MongoClient>;
};

export const mongoClient =
  globalForMongo.__pizzaHubMongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 10000,
  });

if (!globalForMongo.__pizzaHubMongoClient) {
  globalForMongo.__pizzaHubMongoClient = mongoClient;
}

export const mongoClientPromise =
  globalForMongo.__pizzaHubMongoClientPromise ??
  mongoClient.connect();

if (!globalForMongo.__pizzaHubMongoClientPromise) {
  globalForMongo.__pizzaHubMongoClientPromise = mongoClientPromise;
}

export const db = mongoClient.db("pizza_hub");