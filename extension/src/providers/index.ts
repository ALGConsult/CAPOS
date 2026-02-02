import { MockProvider } from "./MockProvider";
import { createRemoteProvider } from "./RemoteProvider";
import type { ContentProvider } from "../types/content";

const DEFAULTS = {
  contentBaseUrl: "",
  sanityProjectId: "",
  sanityDataset: "",
  sanityApiVersion: "v2024-01-01",
  sanityUseCdn: true,
};

export async function getContentProvider(): Promise<ContentProvider> {
  const stored = await chrome.storage.sync.get(Object.keys(DEFAULTS));
  const opts = { ...DEFAULTS, ...stored } as typeof DEFAULTS;

  if (opts.contentBaseUrl) {
    try {
      const remote = createRemoteProvider(opts.contentBaseUrl);
      await remote.getMenu();
      return remote;
    } catch {
      return MockProvider;
    }
  }

  return MockProvider;
}
