import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = process.cwd();

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const target = path.join(root, specifier.slice(2));
    return resolveFile(target);
  }

  if ((specifier.startsWith("../") || specifier.startsWith("./")) && context.parentURL) {
    const parentPath = new URL(context.parentURL).pathname;
    const target = path.resolve(path.dirname(parentPath), specifier);
    if (!path.extname(target)) return resolveFile(target);
  }

  return nextResolve(specifier, context);
}

function resolveFile(target) {
  const candidates = path.extname(target) ? [target] : [`${target}.ts`, `${target}.mts`, path.join(target, "index.ts"), target];
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) return { url: pathToFileURL(target).href, shortCircuit: true };
  return { url: pathToFileURL(found).href, shortCircuit: true };
}
