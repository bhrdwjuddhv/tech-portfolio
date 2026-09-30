// Worker bindings (D1) and vars/secrets, importable anywhere in the app.
import { env } from "cloudflare:workers";

export const db = env.DB;
export default env;
