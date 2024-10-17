import { readFileSync } from "node:fs";

/** @type {import('./loader').resolve} */
export async function resolve(specifier, context, defaultResolve) {
  // console.log(`Resolving ${specifier}`);

  if ([".svg", ".jpg", ".png"].some((ext) => specifier.endsWith(ext))) {
    // console.log(
    //   `Requiring image at ${specifier}`,
    //   path.join(path.dirname(context.parentURL ?? ""), specifier),
    // );
    return {
      shortCircuit: true,
      url: context.parentURL
        ? new URL(specifier, context.parentURL).href
        : new URL(specifier).href,
    };
  }
  return defaultResolve(specifier, context);
}

/** @type {import('./loader').load} */
export async function load(url, context, defaultLoad) {
  // console.log(`Loading ${url}`, context.format);
  if ([".svg", ".jpg", ".png"].some((ext) => url.endsWith(ext))) {
    // console.log(`Loading image at ${url}`);
    const content = readFileSync(new URL(url));
    return {
      shortCircuit: true,
      format: "module",
      source: `export default ${JSON.stringify(content.toString("base64"))};`,
    };
  }
  return defaultLoad(url, context);
}
