import type { Adapter, DatabaseSession, DatabaseUser } from "lucia";
import { Client, Executor } from "edgedb";
import * as queries from "./queries";

export type * from "./queries";

type Queries = typeof queries;

type DatabaseFunctions<T> = {
    readonly [K in keyof T]: T[K] extends (client: Client, args: infer A) => infer R
        ? unknown extends A
            ? () => R
            : (args: A) => R
        : never;
};

type Database<T> = DatabaseFunctions<T> & {
    transaction: <R>(action: (tx: DatabaseTransaction<T>) => Promise<R>) => Promise<R>;
    withGlobals: (globals: { [name: string]: any }) => DatabaseWithGlobals<T>;
};

type DatabaseWithGlobals<T> = DatabaseFunctions<T> & {
    transaction: <R>(action: (tx: DatabaseTransaction<T>) => Promise<R>) => Promise<R>;
};

type DatabaseTransaction<T> = {
    readonly [K in keyof T]: T[K] extends (client: Executor, args: infer A) => infer R ? (args: A) => R : never;
};

export const createDatabase = (client: Client): Database<Queries> => {
    const createTransactionProxy = (tx: Executor): DatabaseTransaction<Queries> => {
        return new Proxy({} as DatabaseTransaction<Queries>, {
            get: (target, prop) => {
                if (typeof prop === "string" && prop in queries) {
                    return (args: any) => queries[prop as keyof Queries](tx, args);
                }

                throw new Error(`Property ${String(prop)} does not exist on queries`);
            },
        });
    };

    const createProxy = (client: Client): Database<Queries> => {
        return new Proxy({} as Database<Queries>, {
            get: (target, prop) => {
                if (typeof prop === "string" && prop in queries) {
                    return (args: any) => queries[prop as keyof Queries](client, args);
                }

                if (prop === "transaction") {
                    return async (action: (tx: DatabaseTransaction<Queries>) => Promise<any>) => {
                        return await client.transaction(async (tx) => {
                            const txDatabase = createTransactionProxy(tx);
                            return await action(txDatabase);
                        });
                    };
                }

                if (prop === "withGlobals") {
                    return (globals: { [name: string]: any }) => {
                        return createProxy(client.withGlobals(globals));
                    };
                }

                throw new Error(`Property ${String(prop)} does not exist on queries`);
            },
        });
    };

    return createProxy(client);
};

export class EdgeDBAdapter implements Adapter {
    private database: Database<Queries>;

    constructor(database: Database<Queries>) {
        this.database = database;
    }

    async deleteSession(sessionId: string) {
        await this.database.deleteSession({
            session_id: sessionId,
        });
    }

    async deleteUserSessions(userId: string) {
        await this.database.deleteUserSessions({
            user_id: userId,
        });
    }

    async getSessionAndUser(sessionId: string): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
        const result = await this.database.getSessionAndUser({
            session_id: sessionId,
        });

        if (result === null) {
            return [null, null];
        }

        const { id: _, session_id, expires_at, user, ...sessionAttributes } = result;
        const { id: userId, ...userAttributes } = user;

        return [
            {
                id: session_id,
                expiresAt: expires_at,
                attributes: sessionAttributes,
                userId: user.id,
            },
            { id: userId, attributes: userAttributes },
        ];
    }

    async getUserSessions(userId: string) {
        const result = await this.database.getUserSessions({
            user_id: userId,
        });

        return result.map((session) => {
            const { id: _, session_id, expires_at, user, ...sessionAttributes } = session;

            return {
                id: session_id,
                expiresAt: expires_at,
                userId: user.id,
                attributes: sessionAttributes,
            };
        });
    }

    async setSession(session: DatabaseSession) {
        await this.database.setSession({
            session_id: session.id,
            user_id: session.userId,
            expires_at: session.expiresAt,
            ...session.attributes,
        });
    }

    async updateSessionExpiration(sessionId: string, expiresAt: Date) {
        await this.database.updateSessionExpiration({
            session_id: sessionId,
            expires_at: expiresAt,
        });
    }

    async deleteExpiredSessions() {
        await this.database.deleteExpiredSessions();
    }
}
