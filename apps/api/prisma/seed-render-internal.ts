import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  createInternalRenderDemoDatabase,
  runRenderDemoSeedWithPolicy,
} from "./seed-render-demo.js";
import { validateRenderInternalSeedPolicy } from "./seed-render-internal.policy.js";

function isMainModule(): boolean {
  const entrypoint = process.argv[1];
  return typeof entrypoint === "string" && import.meta.url === pathToFileURL(resolve(entrypoint)).href;
}

if (isMainModule()) {
  runRenderDemoSeedWithPolicy(
    process.env,
    validateRenderInternalSeedPolicy,
    createInternalRenderDemoDatabase,
  )
    .then((result) => console.log(`Render Internal demo seed ${result.status}: ${JSON.stringify(result.created)}`))
    .catch(() => { console.error("Render Internal demo seed failed."); process.exitCode = 1; });
}
