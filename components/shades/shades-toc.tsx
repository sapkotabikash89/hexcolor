'use client';

import { useState } from 'react';
import { CopyButton } from '@/components/copy-button';
import { Button } from '@/components/ui/button';
import { getContrastColor } from '@/lib/color-utils';

interface Shade {
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
  slug?: string;
}

interface ShadesTOCProps {
  shades: Shade[];
}

export function ShadesTOC({ shades }: ShadesTOCProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTOC = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-8">
      <Button
        onClick={toggleTOC}
        variant="outline"
        className="w-full justify-start font-medium"
      >
        {isOpen ? 'Hide Shades' : 'Jump to Shades'}
      </Button>
      
      {isOpen && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Color</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Hex</th>
                <th className="px-4 py-2 text-left">RGB</th>
                <th className="px-4 py-2 text-left">CMYK</th>
              </tr>
            </thead>
            <tbody>
              {shades.map((shade, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-2">
                    <div 
                      className="w-5 h-5 rounded-full border border-border"
                      style={{ backgroundColor: shade.hex }}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <a 
                      href={`#${shade.slug || shade.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {shade.name}
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <CopyButton 
                      value={shade.hex.toUpperCase()} 
                      label={shade.hex.toUpperCase()} 
                      showIcon={false}
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto font-mono text-sm"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <CopyButton 
                      value={shade.rgb} 
                      label={shade.rgb} 
                      showIcon={false}
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto font-mono text-sm"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <CopyButton 
                      value={shade.cmyk} 
                      label={shade.cmyk} 
                      showIcon={false}
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto font-mono text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}