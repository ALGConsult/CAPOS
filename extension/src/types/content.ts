export interface MenuItem {
  title: string;
  slug: string;
  order: number;
  children?: MenuItem[];
}

export interface ContentBlock {
  type: string;
  content?: string;
  [key: string]: unknown;
}

export interface Page {
  title: string;
  slug: string;
  blocks: ContentBlock[];
}

export interface ContentProvider {
  getMenu(): Promise<MenuItem[]>;
  getPage(slug: string): Promise<Page | null>;
}
