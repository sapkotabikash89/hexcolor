"use client"

import { useState } from "react"
import Link from "next/link"
import ColorSwatchLink from "@/components/color-swatch-link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Pipette } from "lucide-react"
import { hexToRgb, rgbToHsl, rgbToCmyk } from "@/lib/color-utils"
import { CopyButton } from "@/components/copy-button"
import { ShareButtons } from "@/components/share-buttons"
import { getColorPageLink } from "@/lib/color-linking-utils"

export function ScreenColorPickerTool() {
  const [selectedColor, setSelectedColor] = useState("#E0115F")
  const [pickedColors, setPickedColors] = useState<string[]>([])
  const [isSupported, setIsSupported] = useState(true)

  const handlePickColor = async () => {
    if ("EyeDropper" in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper()
        const result = await eyeDropper.open()
        setSelectedColor(result.sRGBHex.toUpperCase())

        if (!pickedColors.includes(result.sRGBHex.toUpperCase())) {
          setPickedColors([result.sRGBHex.toUpperCase(), ...pickedColors])
        }
      } catch {
        console.log("User cancelled color picker")
      }
    } else {
      setIsSupported(false)
    }
  }

  const rgb = hexToRgb(selectedColor)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null

  return (
    <div className="space-y-8">
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Pick Color from Screen</h2>
          </div>
          <p className="text-muted-foreground">
            Click the button below to activate the screen color picker and select any color from your screen
          </p>

          {isSupported ? (
            <>
              <Button onClick={handlePickColor} size="lg" className="w-full gap-2">
                <Pipette className="w-5 h-5" />
                Pick Color from Screen
              </Button>

              <div className="p-6 bg-muted rounded-lg space-y-4">
                <div className="flex items-center gap-6">
                  <ColorSwatchLink
                    hex={selectedColor}
                    className="w-32 h-32 rounded-lg border-2 border-border block"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">HEX</span>
                        <p className="font-mono font-semibold text-lg">{selectedColor}</p>
                      </div>
                      <CopyButton value={selectedColor} />
                    </div>
                    {rgb && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-muted-foreground">RGB</span>
                            <p className="font-mono">
                              ({rgb.r}, {rgb.g}, {rgb.b})
                            </p>
                          </div>
                          <CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
                        </div>
                        {hsl && (
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-muted-foreground">HSL</span>
                              <p className="font-mono">
                                ({hsl.h}°, {hsl.s}%, {hsl.l}%)
                              </p>
                            </div>
                            <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                          </div>
                        )}
                        {cmyk && (
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-muted-foreground">CMYK</span>
                              <p className="font-mono">
                                ({cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%)
                              </p>
                            </div>
                            <CopyButton value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href={getColorPageLink(selectedColor)}>Explore This Color</Link>
                </Button>
              </div>

              {pickedColors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Recently Picked Colors</h3>
                  <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                    {pickedColors.map((color, index) => (
                      <ColorSwatchLink key={index} hex={color} className="group cursor-pointer block">
                        <div
                          className="aspect-square rounded-md hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                        <p className="text-xs font-mono text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {color}
                        </p>
                      </ColorSwatchLink>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPickedColors([])} className="w-full">
                    Clear All
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 bg-destructive/10 border-2 border-destructive/20 rounded-lg">
              <p className="text-destructive font-semibold">EyeDropper API Not Supported</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your browser doesn&apos;t support the EyeDropper API. Please use Chrome, Edge, or Opera browser for this
                feature.
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-center py-4">
        <ShareButtons title="Screen Color Picker Tool - HexColorMeans" />
      </div>
    </div>
  )
}
