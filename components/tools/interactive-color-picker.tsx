"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import {
  getContrastColor,
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToHex
} from "@/lib/color-utils";

import ColorSwatchLink from "@/components/color-swatch-link";

interface InteractiveColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export function InteractiveColorPicker({ selectedColor, onColorChange }: InteractiveColorPickerProps) {
  const [hue, setHue] = useState(230);
  const [saturation, setSaturation] = useState(70);
  const [lightness, setLightness] = useState(60);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const animationFrameRef = useRef<number>(0);
  const isDraggingRef = useRef(false);

  const hueRef = useRef(hue);
  const saturationRef = useRef(saturation);
  const lightnessRef = useRef(lightness);

  useEffect(() => {
    const updateRect = () => {
        if (canvasRef.current) {
            rectRef.current = canvasRef.current.getBoundingClientRect();
        }
    };
    updateRect();
    const resizeObserver = new ResizeObserver(updateRect);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });
    return () => {
        resizeObserver.disconnect();
        window.removeEventListener('scroll', updateRect);
        window.removeEventListener('resize', updateRect);
    };
  }, []);

  useEffect(() => {
    hueRef.current = hue;
    saturationRef.current = saturation;
    lightnessRef.current = lightness;
  }, [hue, saturation, lightness]);

  useEffect(() => {
    const rgb = hexToRgb(selectedColor);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
    }
  }, [selectedColor]);

  useEffect(() => {
    drawColorSpace();
  }, [hue]);

  const drawColorSpace = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const s = (x / width) * 100;
        const l = 100 - (y / height) * 100;
        const rgb = hslToRgb(hueRef.current, s, l);

        data[idx] = rgb.r;     // R
        data[idx + 1] = rgb.g;   // G
        data[idx + 2] = rgb.b;   // B
        data[idx + 3] = 255;     // A
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  const throttledColorUpdate = useCallback(
    (newSaturation: number, newLightness: number) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const clampedSaturation = Math.max(0, Math.min(100, Math.round(newSaturation)));
        const clampedLightness = Math.max(0, Math.min(100, Math.round(newLightness)));

        setSaturation(clampedSaturation);
        setLightness(clampedLightness);

        const rgb = hslToRgb(hueRef.current, clampedSaturation, clampedLightness);
        const newColor = rgbToHex(rgb.r, rgb.g, rgb.b);
        onColorChange(newColor);
      });
    },
    [onColorChange]
  );

  const handleCanvasInteraction = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    let rect = rectRef.current;
    if (!rect) {
        rect = canvas.getBoundingClientRect();
        rectRef.current = rect;
    }

    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    const newSaturation = (canvasX / canvas.width) * 100;
    const newLightness = 100 - (canvasY / canvas.height) * 100;

    throttledColorUpdate(newSaturation, newLightness);
  }, [throttledColorUpdate]);

  const handleHueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number.parseInt(e.target.value);
    setHue(newHue);

    const rgb = hslToRgb(newHue, saturationRef.current, lightnessRef.current);
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    onColorChange(newColor);
  }, [onColorChange]);

  const memoizedValues = useMemo(() => {
    const rgb = hexToRgb(selectedColor);
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
    return { rgb, hsl };
  }, [selectedColor]);

  const pickerX = `${Math.max(0, Math.min(100, saturation))}%`;
  const pickerY = `${Math.max(0, Math.min(100, 100 - lightness))}%`;

  return (
    <Card className="p-3 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold">Interactive Color Picker</h2>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="relative w-full max-w-[320px] sm:max-w-[400px]">
            <canvas
              ref={canvasRef}
              width={400}
              height={280}
              className="w-full h-auto aspect-[10/7] rounded-lg border-2 border-border cursor-crosshair touch-none"
              onClick={handleCanvasInteraction}
              onMouseMove={(e) => {
                if (isDraggingRef.current) {
                  e.preventDefault();
                  handleCanvasInteraction(e);
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                isDraggingRef.current = true;
                handleCanvasInteraction(e);
              }}
              onMouseUp={() => {
                isDraggingRef.current = false;
              }}
              onMouseLeave={() => {
                isDraggingRef.current = false;
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                isDraggingRef.current = true;
                handleCanvasInteraction(e);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                handleCanvasInteraction(e);
              }}
              onTouchEnd={() => {
                isDraggingRef.current = false;
              }}
            />
            <div
              className="absolute w-4 h-4 sm:w-5 sm:h-5 border-2 border-white rounded-full pointer-events-none"
              style={{
                left: pickerX,
                top: pickerY,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          </div>

          <div className="space-y-2 w-full max-w-[320px] sm:max-w-[400px]">
            <label className="text-sm font-medium">Hue: {hue}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              className="w-full h-3 sm:h-4 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(0, 100%, 50%), 
                  hsl(60, 100%, 50%), 
                  hsl(120, 100%, 50%), 
                  hsl(180, 100%, 50%), 
                  hsl(240, 100%, 50%), 
                  hsl(300, 100%, 50%), 
                  hsl(360, 100%, 50%))`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <ColorSwatchLink
              hex={selectedColor}
              className="w-full h-32 sm:h-40 rounded-lg border-2 border-border flex items-center justify-center font-mono font-semibold text-base sm:text-lg block"
              style={{ backgroundColor: selectedColor, color: getContrastColor(selectedColor) }}
            >
              {selectedColor.toUpperCase()}
            </ColorSwatchLink>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm text-muted-foreground">HEX</span>
                <p className="font-mono font-semibold text-sm sm:text-base truncate">{selectedColor}</p>
              </div>
              <CopyButton value={selectedColor} />
            </div>
            {memoizedValues.rgb && (
              <>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm text-muted-foreground">RGB</span>
                    <p className="font-mono text-sm sm:text-base truncate">
                      ({memoizedValues.rgb.r}, {memoizedValues.rgb.g}, {memoizedValues.rgb.b})
                    </p>
                  </div>
                  <CopyButton value={`rgb(${memoizedValues.rgb.r}, ${memoizedValues.rgb.g}, ${memoizedValues.rgb.b})`} />
                </div>
                {memoizedValues.hsl && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs sm:text-sm text-muted-foreground">HSL</span>
                      <p className="font-mono text-sm sm:text-base truncate">
                        ({memoizedValues.hsl.h}°, {memoizedValues.hsl.s}%, {memoizedValues.hsl.l}%)
                      </p>
                    </div>
                    <CopyButton value={`hsl(${memoizedValues.hsl.h}, ${memoizedValues.hsl.s}%, ${memoizedValues.hsl.l}%)`} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
