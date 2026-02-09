"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import {
  hexToRgb,
  rgbToHsv,
  hsvToRgb,
  rgbToHex,
  rgbToHsl,
  getContrastColor
} from "@/lib/color-utils";

import ColorSwatchLink from "@/components/color-swatch-link";

interface InteractiveColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export function InteractiveColorPicker({ selectedColor, onColorChange }: InteractiveColorPickerProps) {
  const [hue, setHue] = useState(312);
  const [saturation, setSaturation] = useState(49);
  const [valueV, setValueV] = useState(44);


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const animationFrameRef = useRef<number>(0);
  const isDraggingRef = useRef(false);

  const hueRef = useRef(hue);
  const saturationRef = useRef(saturation);
  const valueVRef = useRef(valueV);

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
    valueVRef.current = valueV;
  }, [hue, saturation, valueV]);

  useEffect(() => {
    const rgb = hexToRgb(selectedColor);
    if (rgb) {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setHue(hsv.h);
      setSaturation(hsv.s);
      setValueV(hsv.v);
    }
  }, [selectedColor]);

  useEffect(() => {
    drawColorSpace();
  }, [hue]);

  const drawColorSpace = useCallback(() => {
    // Canvas rendering removed as we use CSS gradients
  }, []);

  const throttledColorUpdate = useCallback(
    (newSaturation: number, newValueV: number) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const clampedSaturation = Math.max(0, Math.min(100, Math.round(newSaturation)));
        const clampedValueV = Math.max(0, Math.min(100, Math.round(newValueV)));

        setSaturation(clampedSaturation);
        setValueV(clampedValueV);

        const rgb = hsvToRgb(hueRef.current, clampedSaturation, clampedValueV);
        const newColor = rgbToHex(rgb.r, rgb.g, rgb.b);
        onColorChange(newColor);
      });
    },
    [onColorChange]
  );

  const handleCanvasInteraction = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();

    const container = canvasRef.current;
    if (!container) return;

    let rect = rectRef.current;
    if (!rect) {
      rect = container.getBoundingClientRect();
      rectRef.current = rect;
    }

    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as any).clientX;
      clientY = (e as any).clientY;
    }

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

    const newSaturation = (x / rect.width) * 100;
    const newValueV = 100 - (y / rect.height) * 100;

    throttledColorUpdate(newSaturation, newValueV);
  }, [throttledColorUpdate]);

  const handleHueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number.parseInt(e.target.value);
    setHue(newHue);

    const rgb = hsvToRgb(newHue, saturationRef.current, valueVRef.current);
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    onColorChange(newColor);
  }, [onColorChange]);

  const handleSaturationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSaturation = Number.parseInt(e.target.value);
    setSaturation(newSaturation);

    const rgb = hsvToRgb(hueRef.current, newSaturation, valueVRef.current);
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    onColorChange(newColor);
  }, [onColorChange]);

  const handleBrightnessChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValueV = Number.parseInt(e.target.value);
    setValueV(newValueV);

    const rgb = hsvToRgb(hueRef.current, saturationRef.current, newValueV);
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    onColorChange(newColor);
  }, [onColorChange]);

  const memoizedValues = useMemo(() => {
    const rgb = hexToRgb(selectedColor);
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
    return { rgb, hsl };
  }, [selectedColor]);

  const pickerX = `${Math.max(0, Math.min(100, saturation))}%`;
  const pickerY = `${Math.max(0, Math.min(100, 100 - valueV))}%`;

  return (
    <Card className="p-3 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold">Interactive Color Picker</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 px-1 sm:px-0 w-full">
        {/* Left Column: Color picker area (Picker Square + Sliders) */}
        <div className="space-y-6 w-full">
          <div className="relative w-full">
            <div
              ref={canvasRef as any}
              className="w-full h-[240px] sm:h-[300px] rounded-xl border-2 border-border cursor-crosshair touch-none overflow-hidden relative shadow-inner"
              style={{
                backgroundColor: `hsl(${hue}, 100%, 50%)`,
                backgroundImage: `
                  linear-gradient(to right, #fff, transparent),
                  linear-gradient(to top, #000, transparent)
                `
              }}
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
              className="absolute w-5 h-5 border-2 border-white rounded-full pointer-events-none"
              style={{
                left: pickerX,
                top: pickerY,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          </div>

          <div className="space-y-5">
            {/* Hue Slider */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-semibold flex justify-between">
                <span>Hue</span>
                <span>{hue}°</span>
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={handleHueChange}
                className="w-full h-4 rounded-full appearance-none cursor-pointer border border-border shadow-sm"
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

            {/* Saturation Slider */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-semibold flex justify-between">
                <span>Saturation</span>
                <span>{saturation}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={handleSaturationChange}
                className="w-full h-4 rounded-full appearance-none cursor-pointer border border-border shadow-sm"
                style={{
                  background: `linear-gradient(to right, #808080, hsl(${hue}, 100%, 50%))`
                }}
              />
            </div>

            {/* Brightness/Value Slider */}
            <div className="space-y-2 w-full">
              <label className="text-sm font-semibold flex justify-between">
                <span>Brightness</span>
                <span>{valueV}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={valueV}
                onChange={handleBrightnessChange}
                className="w-full h-4 rounded-full appearance-none cursor-pointer border border-border shadow-sm"
                style={{
                  background: `linear-gradient(to right, #000, hsl(${hue}, ${saturation}%, 50%))`
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Color Display and Action Area */}
        <div className="flex flex-col gap-4 w-full">
          {/* Main Color Swatch */}
          <ColorSwatchLink
            hex={selectedColor}
            className="w-full aspect-[2/1] sm:aspect-auto sm:h-36 rounded-xl border-2 border-border flex items-center justify-center font-mono text-xl sm:text-2xl font-bold shadow-md"
            style={{
              backgroundColor: selectedColor,
              color: getContrastColor(selectedColor),
            }}
          >
            {selectedColor.toUpperCase()}
          </ColorSwatchLink>

          {/* Color Values Boxes */}
          <div className="space-y-3">
            <div className="p-3 bg-muted/40 border border-border/50 rounded-xl relative group font-mono">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">HEX</span>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-bold">{selectedColor.toUpperCase()}</span>
                <CopyButton value={selectedColor.toUpperCase()} />
              </div>
            </div>
            {memoizedValues.rgb && (
              <div className="p-3 bg-muted/40 border border-border/50 rounded-xl relative group font-mono">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">RGB</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold">({memoizedValues.rgb.r}, {memoizedValues.rgb.g}, {memoizedValues.rgb.b})</span>
                  <CopyButton value={`rgb(${memoizedValues.rgb.r}, ${memoizedValues.rgb.g}, ${memoizedValues.rgb.b})`} />
                </div>
              </div>
            )}
            {memoizedValues.hsl && (
              <div className="p-3 bg-muted/40 border border-border/50 rounded-xl relative group font-mono">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">HSL</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold">({memoizedValues.hsl.h}°, {memoizedValues.hsl.s}%, {memoizedValues.hsl.l}%)</span>
                  <CopyButton value={`hsl(${memoizedValues.hsl.h}, ${memoizedValues.hsl.s}%, ${memoizedValues.hsl.l}%)`} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
