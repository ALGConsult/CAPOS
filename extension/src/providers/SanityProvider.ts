import type { MenuItem, Page } from "../types/content";

export interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion?: string;
  useCdn?: boolean;
}

/**
 * SanityProvider – scaffold for future Sanity integration.
 * Replace with GROQ queries when ready.
 */
export function createSanityProvider(_config: SanityConfig) {
  return {
    async getMenu(): Promise<MenuItem[]> {
      throw new Error("SanityProvider not implemented. Use MockProvider or RemoteProvider.");
    },
    async getPage(_slug: string): Promise<Page | null> {
      throw new Error("SanityProvider not implemented. Use MockProvider or RemoteProvider.");
    },
  };
}
