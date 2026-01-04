import { createPool } from "mysql2";
import { Pool, PoolOptions } from "mysql2";
import config from "../config.json";

/**
 * Handles connection to the database.
 */
class DatabaseConnection {
    private pool: Pool;

    constructor(options: PoolOptions) {
        this.pool = createPool(options);
    }

    /**
     * Execute a MySQL database query.
     *
     * @param sql The sql string to execute
     * @param params Query params
     * @returns A promise resolving the results of the query
     */
    public execute(sql: string, params?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.pool.query(sql, params, (err, results, fields) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }

    /**
     * Ensures a MySQL result is correct.
     *
     * @param result The MySQL result
     * @param type The type of result expected
     * @returns
     */
    // TODO: UPDATE THIS
    public ensureResult(result: any, type: "array" | "object" | "insertId") {
        if (!result) {
            return;
        }
        if (type === "array") {
            if (result.length === 0) {
                return [];
            }
            return result;
        }
        if (type === "object") {
            if (result.length === 0) {
                return null;
            }
            return result[0];
        }
        return result.insertId;
    }
}

declare var global: {
    connection: DatabaseConnection
};

if (!global.connection) {
    global.connection = new DatabaseConnection(config.mysql);
}

export default global.connection;