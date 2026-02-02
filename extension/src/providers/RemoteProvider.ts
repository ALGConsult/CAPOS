import type { MenuItem, Page } from "../types/content";

export function createRemoteProvider(baseUrl: string) {
  const normalize = (url: string) => url.replace(/\/$/, "");
  const base = normalize(baseUrl);

  return {
    async getMenu(): Promise<MenuItem[]> {
      const res = await fetch(`${base}/menu`);
      if (!res.ok) throw new Error("Failed to fetch menu");
      const items = (await res.json()) as MenuItem[];
      return items.sort((a, b) => a.order - b.order);
    },
    async getPage(slug: string): Promise<Page | null> {
      const res = await fetch(`${base}/page/${encodeURIComponent(slug)}`);
      if (!res.ok) return null;
      return (await res.json()) as Page;
    },
  };
}
