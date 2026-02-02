import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const KEYS = {
  contentBaseUrl: "contentBaseUrl",
  sanityProjectId: "sanityProjectId",
  sanityDataset: "sanityDataset",
  sanityApiVersion: "sanityApiVersion",
  sanityUseCdn: "sanityUseCdn",
} as const;

function Options() {
  const [contentBaseUrl, setContentBaseUrl] = useState("");
  const [sanityProjectId, setSanityProjectId] = useState("");
  const [sanityDataset, setSanityDataset] = useState("production");
  const [sanityApiVersion, setSanityApiVersion] = useState("v2024-01-01");
  const [sanityUseCdn, setSanityUseCdn] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(Object.values(KEYS), (stored) => {
      setContentBaseUrl((stored.contentBaseUrl as string) ?? "");
      setSanityProjectId((stored.sanityProjectId as string) ?? "");
      setSanityDataset((stored.sanityDataset as string) ?? "production");
      setSanityApiVersion((stored.sanityApiVersion as string) ?? "v2024-01-01");
      setSanityUseCdn((stored.sanityUseCdn as boolean) ?? true);
    });
  }, []);

  const save = () => {
    chrome.storage.sync.set({
      contentBaseUrl: contentBaseUrl.trim() || "",
      sanityProjectId: sanityProjectId.trim() || "",
      sanityDataset: sanityDataset.trim() || "production",
      sanityApiVersion: sanityApiVersion.trim() || "v2024-01-01",
      sanityUseCdn,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 480 }}>
      <h1 style={{ marginTop: 0 }}>CAPOS Options</h1>

      <section style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          Content base URL (Render service)
        </label>
        <input
          type="url"
          value={contentBaseUrl}
          onChange={(e) => setContentBaseUrl(e.target.value)}
          placeholder="https://your-service.onrender.com"
          style={{
            width: "100%",
            padding: 8,
            fontSize: 14,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#666" }}>
          Leave empty to use mock content.
        </p>
      </section>

      <section style={{ marginBottom: 24, paddingTop: 16, borderTop: "1px solid #eee" }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          Sanity (scaffold for later)
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Project ID</label>
            <input
              type="text"
              value={sanityProjectId}
              onChange={(e) => setSanityProjectId(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                fontSize: 14,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Dataset</label>
            <input
              type="text"
              value={sanityDataset}
              onChange={(e) => setSanityDataset(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                fontSize: 14,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 13 }}>API version</label>
            <input
              type="text"
              value={sanityApiVersion}
              onChange={(e) => setSanityApiVersion(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                fontSize: 14,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
            />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={sanityUseCdn}
              onChange={(e) => setSanityUseCdn(e.target.checked)}
            />
            Use CDN
          </label>
        </div>
      </section>

      <button
        type="button"
        onClick={save}
        style={{
          padding: "10px 20px",
          fontSize: 14,
          fontWeight: 600,
          background: "#2D0240",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        {saved ? "Saved ✓" : "Save"}
      </button>
    </div>
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<Options />);
