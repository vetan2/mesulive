export interface ResolveContext {
  conditions: string[];
  parentURL?: string;
}

export interface ResolveResult {
  url: string;
}

export interface LoadContext {
  format: string | null;
}

export interface LoadResult {
  format: "module" | "commonjs";
  source: string;
}

export type resolve = (
  specifier: string,
  context: ResolveContext,
  defaultResolve: (
    specifier: string,
    context: ResolveContext,
  ) => Promise<ResolveResult>,
) => Promise<ResolveResult> | ResolveResult;

export type load = (
  url: string,
  context: LoadContext,
  defaultLoad: (url: string, context: LoadContext) => Promise<LoadResult>,
) => Promise<LoadResult> | LoadResult;
