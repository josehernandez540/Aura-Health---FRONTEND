import React, { useEffect, useRef, useState } from "react";
import "./hovermenu.css";

interface HoverMenuProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  align?: "left" | "right";
}

const GAP = 10;
// Panels are a single row of icon buttons; this is a safe upper-bound
// estimate used only to decide whether there's room above the trigger,
// since the real height isn't known until the panel itself has rendered.
const PANEL_HEIGHT_ESTIMATE = 60;

// Comparing against the viewport top isn't enough: a table's own scroll
// wrapper (overflow-x: auto, which forces overflow-y: auto too per the CSS
// overflow spec) sits flush above the first row, so "above" placement can
// collide with the table header well before running out of viewport space.
const getScrollParentTop = (el: HTMLElement | null): number => {
  let node = el?.parentElement ?? null;
  while (node && node !== document.body) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") {
      return node.getBoundingClientRect().top;
    }
    node = node.parentElement;
  }
  return 0;
};

const HoverMenu: React.FC<HoverMenuProps> = ({ trigger, children, align = "right" }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [placement, setPlacement] = useState<"above" | "below">("above");
  const anchorRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const updatePosition = () => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return;
    const boundaryTop = getScrollParentTop(anchorRef.current);
    const placeBelow = rect.top - PANEL_HEIGHT_ESTIMATE - GAP < boundaryTop;
    setPlacement(placeBelow ? "below" : "above");
    setCoords({
      top: placeBelow ? rect.bottom + GAP : rect.top - GAP,
      left: align === "right" ? rect.right : rect.left,
    });
  };

  const openMenu = () => {
    cancelClose();
    updatePosition();
    setOpen(true);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (anchorRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const handleScroll = () => setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [open]);

  return (
    <div
      ref={anchorRef}
      className="hover-menu-anchor"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      {React.cloneElement(trigger, {
        onClick: () => (open ? setOpen(false) : openMenu()),
      })}

      {open && coords && (
        <div
          className={`hover-menu-panel align-${align} place-${placement}`}
          style={{ top: coords.top, left: coords.left }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {children}
          <div className="hover-menu-caret" />
        </div>
      )}
    </div>
  );
};

export default HoverMenu;
