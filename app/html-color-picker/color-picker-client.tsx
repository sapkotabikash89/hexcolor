"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import dynamic from "next/dynamic";

const ColorSidebar = dynamic(() => import("@/components/sidebar").then((mod) => mod.ColorSidebar), {
  loading: () => <div className="w-full h-96 animate-pulse bg-muted/20 rounded-xl" />
});

const ColorPageContent = dynamic(() => import("@/components/color-page-content").then(mod => mod.ColorPageContent), {
  loading: () => <div className="h-96 w-full animate-pulse bg-muted rounded-lg" />
});

const InteractiveColorPicker = dynamic(() => import("@/components/tools/interactive-color-picker").then(mod => mod.InteractiveColorPicker), {
  loading: () => <div className="h-96 w-full animate-pulse bg-muted rounded-lg" />
});
// import { AnchorHashNav } from "@/components/anchor-hash-nav";
import { TableOfContents } from "@/components/table-of-contents";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  normalizeHex,
  isValidHex,
  getContrastColor as originalGetContrastColor,
  hexToRgb,
  rgbToHsl,
  rgbToCmyk,
  getColorHarmony,
  hslToRgb,
  rgbToHex
} from "@/lib/color-utils";
import { BreadcrumbSchema, FAQSchema, WebPageSchema } from "@/components/structured-data";
import { ShareButtons } from "@/components/share-buttons";

const DEFAULT_HEX = "#E0115F";

export function ColorPickerClientContent() {
  // Get hex from URL query parameter on client side
  const [initialHex, setInitialHex] = useState<string | null>(null);

  useEffect(() => {
    // Client-side only - parse URL parameters
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const hexParam = urlParams.get('hex');
      if (hexParam && isValidHex(`#${hexParam}`)) {
        setInitialHex(`#${hexParam}`);
      } else {
        // If no hex parameter, default to DEFAULT_HEX
        setInitialHex(DEFAULT_HEX);
      }
    }

    // Listen for URL changes to update color when hex parameter changes
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hexParam = urlParams.get('hex');
      if (hexParam && isValidHex(`#${hexParam}`)) {
        setInitialHex(`#${hexParam}`);
      }
    };

    // Listen for hashchange events as well for SPA navigation
    const handleHashChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hexParam = urlParams.get('hex');
      if (hexParam && isValidHex(`#${hexParam}`)) {
        setInitialHex(`#${hexParam}`);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    // Listen for custom color update events from header
    const handleColorUpdate = (e: CustomEvent) => {
      const color = e.detail.color;
      if (color && isValidHex(color)) {
        setInitialHex(color);
      }
    };

    window.addEventListener('colorUpdate', handleColorUpdate as EventListener);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('colorUpdate', handleColorUpdate as EventListener);
    };
  }, []);

  // Don't render anything until we have the initial hex from URL
  if (initialHex === null) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PickerContent initialHex={initialHex} />
  );
}

function PickerContent({ initialHex = DEFAULT_HEX }: { initialHex?: string }) {
  const [currentHex, setCurrentHex] = useState(initialHex);

  // Update color when hex parameter changes
  useEffect(() => {
    setCurrentHex(initialHex);
  }, [initialHex]);

  // Update URL when current hex changes
  useEffect(() => {
    // Update URL to reflect current color
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('hex', currentHex.replace('#', ''));
    window.history.replaceState({}, '', newUrl);
  }, [currentHex]);

  // Derived values
  const rgb = hexToRgb(currentHex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const contrastColor = originalGetContrastColor(currentHex);
  const displayLabel = currentHex;

  // Mock FAQ items since we don't have the full category utils here
  const faqItems = [
    {
      question: `What is the meaning and symbolism of ${currentHex} color?`,
      answer: `${currentHex} is a versatile color that can carry various meanings depending on its context and cultural associations.`
    },
    {
      question: `What psychological effects does ${currentHex} color have?`,
      answer: `${currentHex} can evoke feelings of creativity, energy, and focus depending on its specific hue and saturation.`
    }
  ];

  // Handle swatch clicks - update in-place without navigation
  const handleSwatchClick = (color: string) => {
    const normalized = normalizeHex(color);
    setCurrentHex(normalized);
    // Update URL without navigation
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('hex', normalized.replace('#', '').toLowerCase());
    window.history.pushState({}, '', newUrl);
  };

  // Update current hex with validation
  const updateCurrentHex = (hex: string) => {
    const normalized = normalizeHex(hex);
    if (isValidHex(normalized)) {
      setCurrentHex(normalized);
      // Update URL without navigation
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('hex', normalized.replace('#', ''));
      window.history.pushState({}, '', newUrl);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <WebPageSchema
        name={`${displayLabel} Color Information`}
        url={`https://hexcolormeans.com/html-color-picker?hex=${currentHex.replace("#", "").toLowerCase()}`}
        description={`Explore ${currentHex} color information, conversions, harmonies, variations, and accessibility.`}
      />
      <BreadcrumbSchema items={[
        { name: "HexColorMeans", item: "https://hexcolormeans.com" },
        { name: "Color Names", item: "https://hexcolormeans.com/colors" },
        { name: currentHex.toUpperCase(), item: `https://hexcolormeans.com/html-color-picker?hex=${currentHex.replace("#", "").toLowerCase()}` }
      ]} />
      <FAQSchema faqs={faqItems} />

      {/* Note: noindex is handled via server response headers or robots.txt */}

      <Header />

      {/* Dynamic Color Hero */}
      <section
        className="py-12 px-4 transition-colors duration-300"
        style={{
          backgroundColor: currentHex,
          color: contrastColor,
        }}
      >
        <div className="w-full max-w-[1300px] mx-auto overflow-hidden">
          <BreadcrumbNav
            items={[
              { label: "Color Names", href: "/colors" },
              { label: currentHex.toUpperCase(), href: `/html-color-picker?hex=${currentHex.replace("#", "").toLowerCase()}` },
            ]}
          />
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">{currentHex.toUpperCase()} Color Meaning, Codes and Information</h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl opacity-90 leading-relaxed text-pretty">
              A complete guide to {currentHex.toUpperCase()} covering color values, harmonies, shades, meaning, and practical uses across design, branding, and everyday visuals.
            </p>
            <div className="max-w-4xl mx-auto">
              <div className="font-mono text-xs md:text-sm flex flex-wrap justify-center gap-4">
                <CopyButton showIcon={false} variant="ghost" size="sm" className="p-0 h-auto" label={`HEX: ${currentHex.toUpperCase()}`} value={currentHex.toUpperCase()} />
                {rgb && (
                  <CopyButton
                    showIcon={false}
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto"
                    label={`RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                    value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                  />
                )}
                {hsl && (
                  <CopyButton
                    showIcon={false}
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto"
                    label={`HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                    value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="xl:hidden z-40">
        <TableOfContents currentHex={currentHex} mobileOnly hideFaqs />
      </div>

      {/* Main Content */}
      <main className="w-full max-w-[1300px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left Table of Contents - Sticky (Visible on Desktop/Large Tablet) */}
          <aside className="hidden xl:block w-52 sticky top-28 self-start shrink-0">
            <TableOfContents currentHex={currentHex} hideFaqs />
          </aside>

          {/* Center Content - Flexible width */}
          <article className="flex-1 min-w-0 w-full">
            <div className="space-y-8">
              {/* Advanced Color Picker Tool */}
              <InteractiveColorPicker
                selectedColor={currentHex}
                onColorChange={updateCurrentHex}
              />

              {/* Social Share Section */}
              <div className="flex justify-center py-4">
                <ShareButtons url={`https://hexcolormeans.com/html-color-picker?hex=${currentHex.replace("#", "").toLowerCase()}`} title={`${currentHex.toUpperCase()} HTML Color Code - HexColorMeans`} />
              </div>

              {/* Color Information */}
              <ColorPageContent
                key={currentHex}
                hex={currentHex}
                mode="full"
                faqs={[]}
                onColorChange={updateCurrentHex}
                pageUrl={`https://hexcolormeans.com/html-color-picker?hex=${currentHex.replace("#", "").toUpperCase()}`}
              />
            </div>
          </article>

          {/* Right Sidebar - Hidden below xl to prioritize content width */}
          <aside className="hidden lg:block w-[340px] shrink-0 sticky top-24 self-start">
            <ColorSidebar color={currentHex} onColorChange={updateCurrentHex} />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Helper functions for color harmonies
function getComplementaryColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";
  return `#${(255 - rgb.r).toString(16).padStart(2, '0')}${(255 - rgb.g).toString(16).padStart(2, '0')}${(255 - rgb.b).toString(16).padStart(2, '0')}`;
}

function getAnalogousColors(hex: string): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex, hex, hex];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (!hsl) return [hex, hex, hex];

  const colors = [];
  for (let i = -30; i <= 30; i += 30) {
    const newHue = (hsl.h + i + 360) % 360;
    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
    colors.push(`#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`);
  }

  return colors;
}

