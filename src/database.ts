import { createPool, Pool } from "mysql2/promise";
import config from "../config.json";

declare global {
    var mysqlPool: Pool | undefined;
}

export const pool: Pool = global.mysqlPool ?? createPool(config.mysql);

if (!global.mysqlPool) {
    global.mysqlPool = pool;
}