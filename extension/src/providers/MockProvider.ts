import type { MenuItem, Page } from "../types/content";

const mockMenu: MenuItem[] = [
  { title: "Dashboard", slug: "dashboard", order: 1 },
  { title: "Guides", slug: "guides", order: 2 },
  { title: "Resources", slug: "resources", order: 3 },
];

const mockPages: Record<string, Page> = {
  dashboard: {
    title: "CAPOS Dashboard",
    slug: "dashboard",
    blocks: [
      { type: "heading", content: "Welcome to CAPOS" },
      { type: "paragraph", content: "Your content hub for HubSpot." },
    ],
  },
  guides: {
    title: "Guides",
    slug: "guides",
    blocks: [
      { type: "heading", content: "Guides" },
      { type: "paragraph", content: "Content coming from Sanity soon." },
    ],
  },
  resources: {
    title: "Resources",
    slug: "resources",
    blocks: [
      { type: "heading", content: "Resources" },
      { type: "paragraph", content: "Content coming from Sanity soon." },
    ],
  },
};

export const MockProvider = {
  async getMenu(): Promise<MenuItem[]> {
    return mockMenu.sort((a, b) => a.order - b.order);
  },
  async getPage(slug: string): Promise<Page | null> {
    return mockPages[slug] ?? null;
  },
};
