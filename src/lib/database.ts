import { createDatabase } from "@/edgedb";
import createClient from "edgedb";

const client = createClient({
    tlsSecurity: process.env.NODE_ENV === "development" ? "insecure" : undefined,
});

export const database = createDatabase(client);

export type Database = typeof database;
