import { createPool } from "slonik";
import config from "config";

const pool = createPool(config.get("postgres.url"));

export default pool;
