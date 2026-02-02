import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { CaposIcon } from "../components/capos-icon";
import { ensureCaposNavItem, type CaposNavCallbacks } from "./injectNav";
import { getContentProvider } from "../providers";
import type { MenuItem, Page } from "../types/content";

const HOVER_DELAY_MS = 150;

function useHoverDelay(isHovered: boolean, delay: number) {
  const [delayed, setDelayed] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (t.current) clearTimeout(t.current);
    if (isHovered) {
      t.current = setTimeout(() => setDelayed(true), delay);
    } else {
      setDelayed(false);
    }
    return () => { if (t.current) clearTimeout(t.current); };
  }, [isHovered, delay]);
  return delayed;
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [iconRect, setIconRect] = useState<DOMRect | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [panelPage, setPanelPage] = useState<Page | null>(null);
  const iconRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isHoveringIcon = useRef(false);
  const isHoveringMenu = useRef(false);

  const showMenu = useHoverDelay(menuOpen, HOVER_DELAY_MS);

  const updateIconRect = useCallback(() => {
    if (iconRef.current) setIconRect(iconRef.current.getBoundingClientRect());
  }, []);

  useEffect(() => {
    getContentProvider().then((p) => p.getMenu()).then(setMenuItems);
  }, []);

  useEffect(() => {
    const callbacks: CaposNavCallbacks = {
      onMouseEnter: () => {
        isHoveringIcon.current = true;
        setMenuOpen(true);
        updateIconRect();
      },
      onMouseLeave: () => {
        isHoveringIcon.current = false;
        const close = () => {
          if (!isHoveringIcon.current && !isHoveringMenu.current) setMenuOpen(false);
        };
        setTimeout(close, 50);
      },
      onIconRef: (el) => {
        iconRef.current = el;
        if (el) updateIconRect();
      },
    };

    let teardown: (() => void) | undefined;
    const run = () => {
      if (document.getElementById("capos-nav-item")) return;
      teardown = ensureCaposNavItem(callbacks);
    };

    run();
    const mo = new MutationObserver(() => {
      if (!document.getElementById("capos-nav-item")) run();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      teardown?.();
    };
  }, [updateIconRect]);

  useEffect(() => {
    const onMouseEnter = () => { isHoveringMenu.current = true; };
    const onMouseLeave = () => {
      isHoveringMenu.current = false;
      setTimeout(() => {
        if (!isHoveringIcon.current && !isHoveringMenu.current) setMenuOpen(false);
      }, 50);
    };
    const m = menuRef.current;
    m?.addEventListener("mouseenter", onMouseEnter);
    m?.addEventListener("mouseleave", onMouseLeave);
    return () => {
      m?.removeEventListener("mouseenter", onMouseEnter);
      m?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [showMenu]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || iconRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (panelPage) setPanelPage(null);
        else setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [panelPage]);

  const openPage = useCallback(async (slug: string) => {
    setMenuOpen(false);
    const provider = await getContentProvider();
    const page = await provider.getPage(slug);
    setPanelPage(page ?? null);
  }, []);

  return (
    <>
      {showMenu && iconRect && (
        <div
          ref={menuRef}
          className="capos-menu"
          style={{
            left: iconRect.left + iconRect.width,
            top: iconRect.top,
          }}
          role="menu"
        >
          {menuItems.map((item) => (
            <button
              key={item.slug}
              type="button"
              className="capos-menuItem"
              role="menuitem"
              onClick={() => openPage(item.slug)}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}

      {panelPage && (
        <CaposPanel
          page={panelPage}
          onClose={() => setPanelPage(null)}
        />
      )}
    </>
  );
}

function CaposPanel({ page, onClose }: { page: Page; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="capos-panelOverlay" role="dialog" aria-modal="true">
      <div className="capos-panel">
        <header className="capos-panelHeader">
          <CaposIcon size={28} />
          <h1 className="capos-panelTitle">{page.title}</h1>
          <button
            type="button"
            className="capos-closeBtn"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <main className="capos-panelContent">
          {page.blocks.map((block, i) => (
            <div key={i} className="capos-block">
              {block.type === "heading" && (
                <h2>{block.content}</h2>
              )}
              {block.type === "paragraph" && (
                <p>{block.content}</p>
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export function mountApp(root: ShadowRoot) {
  const container = document.createElement("div");
  container.id = "capos-root";
  container.className = "capos-root";
  root.appendChild(container);
  createRoot(container).render(<App />);
}
