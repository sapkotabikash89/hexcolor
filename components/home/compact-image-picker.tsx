"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { CopyButton } from "@/components/copy-button"

export function CompactImagePicker() {
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                const canvas = canvasRef.current
                if (!canvas) return
                const ctx = canvas.getContext("2d")
                if (!ctx) return

                const maxWidth = 400
                const scale = maxWidth / img.width
                canvas.width = maxWidth
                canvas.height = img.height * scale

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                setImageUrl(event.target?.result as string)
            }
            img.src = event.target?.result as string
        }
        reader.readAsDataURL(file)
    }

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (canvas.width / rect.width)
        const y = (e.clientY - rect.top) * (canvas.height / rect.height)

        const pixel = ctx.getImageData(x, y, 1, 1).data
        const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase()}`
        setSelectedColor(hex)
    }

    return (
        <Card className="p-6 space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Live Image Color Picker</h2>
                <p className="text-sm text-muted-foreground">Extract colors from any image</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />

                    {!imageUrl ? (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-64 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                            <Upload className="w-12 h-12 text-muted-foreground" />
                            <div className="text-center">
                                <p className="font-semibold">Upload an image</p>
                                <p className="text-sm text-muted-foreground">Click anywhere on the image to pick a color</p>
                            </div>
                        </button>
                    ) : (
                        <div className="relative">
                            <canvas
                                ref={canvasRef}
                                onClick={handleCanvasClick}
                                className="w-full rounded-lg border-2 border-border cursor-crosshair"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setImageUrl(null)
                                    setSelectedColor(null)
                                }}
                                className="absolute top-2 right-2"
                            >
                                Change Image
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {selectedColor ? (
                        <>
                            <div
                                className="w-full h-32 rounded-lg border-2 border-border flex items-center justify-center font-mono font-bold text-lg"
                                style={{
                                    backgroundColor: selectedColor,
                                    color: parseInt(selectedColor.slice(1, 3), 16) * 0.299 +
                                        parseInt(selectedColor.slice(3, 5), 16) * 0.587 +
                                        parseInt(selectedColor.slice(5, 7), 16) * 0.114 > 128 ? "#000" : "#fff",
                                }}
                            >
                                {selectedColor}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                                    <div>
                                        <span className="text-xs text-muted-foreground">HEX</span>
                                        <p className="font-mono font-semibold">{selectedColor}</p>
                                    </div>
                                    <CopyButton value={selectedColor} />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                                    <div>
                                        <span className="text-xs text-muted-foreground">RGB</span>
                                        <p className="font-mono text-sm">
                                            ({parseInt(selectedColor.slice(1, 3), 16)}, {parseInt(selectedColor.slice(3, 5), 16)}, {parseInt(selectedColor.slice(5, 7), 16)})
                                        </p>
                                    </div>
                                    <CopyButton value={`rgb(${parseInt(selectedColor.slice(1, 3), 16)}, ${parseInt(selectedColor.slice(3, 5), 16)}, ${parseInt(selectedColor.slice(5, 7), 16)})`} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                            <p>Upload an image and click on it to extract colors</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center pt-2">
                <Link href="/image-color-picker" className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
                    Open full Image Color Picker tool
                    <span className="text-xl">→</span>
                </Link>
            </div>
        </Card>
    )
}
