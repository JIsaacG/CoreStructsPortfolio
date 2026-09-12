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

import { filesFor } from "./build-urls.mjs";

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

  /* The built pages link without `.html`, so this has to resolve a clean URL
     the way the `.htaccess` does or local preview would 404 on every link the
     live site answers. `filesFor` is the same candidate list the rewrite rules
     try, in the same order, imported rather than restated so the two cannot
     drift apart. */
  let file;
  let size;
  for (const candidate of filesFor(requested)) {
    const full = resolve(ROOT, `.${normalize(candidate)}`);
    if (full !== ROOT && !full.startsWith(ROOT + sep)) continue;
    try {
      const stats = statSync(full);
      if (stats.isDirectory()) continue;
      file = full;
      size = stats.size;
      break;
    } catch {
      /* Not this shape; try the next. */
    }
  }

  if (file === undefined) {
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
