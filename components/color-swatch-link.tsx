import React from "react";
import Link from "next/link";
import { getColorPageLink, getColorLinkRel } from "@/lib/color-linking-utils";

interface ColorSwatchLinkProps {
  hex: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function ColorSwatchLink({
  hex,
  children,
  className = "relative flex-1 block h-full",
  style,
  title,
  onClick
}: ColorSwatchLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Dispatch color update event for sidebar/global state sync
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("colorUpdate", { detail: { color: hex } }));
    }

    if (onClick) {
      onClick(e);
    }
  };

  const isNofollow = getColorLinkRel(hex) === "nofollow";

  if (isNofollow) {
    return (
      <div
        className={className}
        style={style}
        title={title || hex}
        onClick={handleClick}
      >
        {children}
      </div>
    );
  }

  return (
    <Link
      href={getColorPageLink(hex)}
      className={className}
      style={style}
      title={title || hex}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
