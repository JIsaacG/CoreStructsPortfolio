/**
 * Se asegura de que el sitio esté sirviéndose. Si BASE_URL no responde,
 * arranca `tools/serve.mjs` del repo en ese puerto y lo apaga al terminar.
 */
import { spawn } from "node:child_process";
import { join } from "node:path";
import { BASE_URL, SITE } from "./paths.mjs";

async function alive(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    return res.status < 500;
  } catch {
    return false;
  }
}

export async function ensureSite() {
  if (await alive(BASE_URL + "/")) return { url: BASE_URL, stop: () => {} };
  const port = new URL(BASE_URL).port || "4173";
  const child = spawn(process.execPath, [join(SITE, "tools", "serve.mjs")], {
    cwd: SITE,
    env: { ...process.env, PORT: port },
    stdio: "ignore",
  });
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250));
    if (await alive(BASE_URL + "/")) {
      console.log(`· sitio servido en ${BASE_URL} (arrancado por el script)`);
      return { url: BASE_URL, stop: () => child.kill() };
    }
  }
  child.kill();
  throw new Error(`El sitio no responde en ${BASE_URL}. Corre "npm run serve" en la raíz del repo.`);
}
