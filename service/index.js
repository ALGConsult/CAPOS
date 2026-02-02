import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

const mockMenu = [
  { title: "Dashboard", slug: "dashboard", order: 1 },
  { title: "Guides", slug: "guides", order: 2 },
  { title: "Resources", slug: "resources", order: 3 },
];

const mockPages = {
  dashboard: {
    title: "CAPOS Dashboard",
    slug: "dashboard",
    blocks: [
      { type: "heading", content: "Welcome to CAPOS" },
      { type: "paragraph", content: "Content from the Render service. Later: Sanity." },
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

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/menu", (req, res) => {
  res.json(mockMenu.sort((a, b) => a.order - b.order));
});

app.get("/page/:slug", (req, res) => {
  const page = mockPages[req.params.slug];
  if (!page) return res.status(404).json({ error: "Not found" });
  res.json(page);
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`CAPOS content service listening on port ${PORT}`);
});
