"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "./icons";

export interface Option {
  label: string;
  value: string | null;
}

export function Dropdown({
  icon,
  options,
  selected,
  onSelect,
  active,
  compact = false,
  align = "left",
}: {
  icon?: React.ReactNode;
  options: Option[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  active?: boolean;
  compact?: boolean;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = options.find((o) => o.value === selected) ?? options[0];
  const isActive = active ?? selected != null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex h-8 items-center gap-1.5 rounded-lg border border-rose bg-cream-50 px-2.5 text-sm transition-colors hover:bg-rose/10 ${
          isActive ? "text-wine font-medium" : "text-ink/80"
        }`}
      >
        {icon}
        <span className={compact ? "hidden md:inline" : ""}>
          {current.label}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="radiogroup"
          className={`absolute z-40 mt-2 max-h-72 w-56 overflow-auto rounded-2xl border border-sand-20 bg-cream p-1 shadow-xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((o) => (
            <li key={o.value ?? "__all"}>
              <button
                type="button"
                role="radio"
                aria-checked={o.value === selected}
                onClick={() => {
                  onSelect(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-cream-50 ${
                  o.value === selected
                    ? "font-semibold text-wine"
                    : "text-ink/80"
                }`}
              >
                <span className="truncate">{o.label}</span>
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full border bg-cream transition-colors ${
                    o.value === selected ? "border-wine" : "border-rose"
                  }`}
                >
                  {o.value === selected && (
                    <span className="size-2.5 rounded-full bg-wine" />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
