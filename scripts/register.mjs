import { register } from "node:module";
import { pathToFileURL } from "node:url";
register("./scripts/loader.mjs", pathToFileURL("./"));
