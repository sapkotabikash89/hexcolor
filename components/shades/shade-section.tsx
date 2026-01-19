'use client';

import { getContrastColor, hexToRgb } from '@/lib/color-utils';

interface ShadeSectionProps {
  name: string;
  hex: string;
  description: string;
  slug?: string;
  cmyk?: string;  // Added cmyk as a string property
}

export function ShadeSection({ name, hex, description, slug, cmyk }: ShadeSectionProps) {
  const rgb = hexToRgb(hex);
  const textColor = getContrastColor(hex);

  const shadeSlug = slug || name.toLowerCase().replace(/\s+/g, '-');

  return (
    <section 
      id={shadeSlug}
      className="mb-12 scroll-mt-24"
    >
      <h2 className="text-2xl font-bold mb-4">{name}</h2>
      <p className="mb-6 text-muted-foreground">{description}</p>
      
      <div 
        className="w-4/5 max-w-2xl p-6 rounded-lg"
        style={{ 
          backgroundColor: hex,
          color: textColor
        }}
      >
        <div className="font-mono text-sm space-y-2">
          <div>
            <span className="font-medium">Hex:</span>{' '}
            <span className="ml-2">{hex.toUpperCase()}</span>
          </div>
          {rgb && (
            <div>
              <span className="font-medium">RGB:</span>{' '}
              <span className="ml-2">rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
            </div>
          )}
          {cmyk && (
            <div>
              <span className="font-medium">CMYK:</span>{' '}
              <span className="ml-2">{cmyk}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}