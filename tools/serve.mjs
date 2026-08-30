/**
 * Zero-dependency static server for local preview: `npm run serve`.
 *
 * XAMPP can serve this project directly — it is plain static files — but this
 * gives the same thing without Apache, and sets the headers (correct MIME
 * types, no caching) that make iterating predictable.
 */

import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(join(dirname(fileURLToPath(import.meta.url)), ".."));
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requested = decodeURIComponent(url.pathname);
  const target = resolve(ROOT, `.${normalize(requested)}`);

  // Never serve outside the project directory.
  if (target !== ROOT && !target.startsWith(ROOT + sep)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  let file = target;
  try {
    if (statSync(file).isDirectory()) file = join(file, "index.html");
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("404");
    return;
  }

  let size;
  try {
    size = statSync(file).size;
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("404");
    return;
  }

  response.writeHead(200, {
    "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
    "content-length": size,
    "cache-control": "no-store",
  });
  createReadStream(file).pipe(response);
}).listen(PORT, () => {
  console.log(`CoreStruct → http://localhost:${PORT}/`);
});
