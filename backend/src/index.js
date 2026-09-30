// Cloudflare Worker entry: runs the Express app through Workers' node:http server support.
import { httpServerHandler } from "cloudflare:node";
import app from "./app.js";

const PORT = 3000; // internal only; wrangler/Cloudflare decide the public port
app.listen(PORT);

export default httpServerHandler({ port: PORT });
