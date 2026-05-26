import { dictionaryTerms } from "@/data/dictionaryTerms";
import type { DictionaryTerm } from "@/types/bazi";

export async function getTerms(): Promise<DictionaryTerm[]> {
  return dictionaryTerms;
}

export async function getTermById(id: string): Promise<DictionaryTerm | undefined> {
  return dictionaryTerms.find((term) => term.id === id);
}

export function findTermByName(name: string): DictionaryTerm | undefined {
  return dictionaryTerms.find((term) => term.name === name || name.includes(term.name) || term.name.includes(name));
}
