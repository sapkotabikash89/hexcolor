"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Palette, Grid, BookOpen } from "lucide-react"

export function Hero() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        })
    }

    return (
        <section
            className="relative w-full overflow-hidden bg-background py-12 lg:py-20 border-b"
            onMouseMove={handleMouseMove}
        >
            <div className="w-full max-w-[1300px] mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 relative z-10">
                <div className="w-full lg:w-1/2 space-y-8 text-left">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance leading-[1.1]">
                            HexColorMeans: Where Every <br /> <span className="text-primary text-pretty">Color Has Meaning</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty">
                            Get accurate color codes, meanings, psychology, and smart conversions in one place.
                            A reliable hub for designers, developers, and creators who want to work with color precision and purpose.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/color-picker">
                            <Button size="lg" className="h-14 px-8 text-base font-semibold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                <Palette className="w-5 h-5" />
                                Color Picker
                            </Button>
                        </Link>
                        <Link href="/color-wheel">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold gap-2 shadow-sm hover:bg-accent transition-all">
                                <Grid className="w-5 h-5" />
                                Color Wheel
                            </Button>
                        </Link>
                        <Link href="/colors">
                            <Button size="lg" variant="ghost" className="h-14 px-8 text-base font-semibold gap-2 transition-all">
                                <BookOpen className="w-5 h-5" />
                                Browse Library
                            </Button>
                        </Link>
                    </div>
                </div>

                <div
                    ref={containerRef}
                    className="w-full lg:w-1/2 h-[400px] md:h-[500px] relative overflow-hidden hidden lg:block rounded-2xl border bg-transparent"
                >
                    <div className="absolute inset-0">
                        {/* Interactive Color Bubbles */}
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full opacity-80 animate-blob pointer-events-none transition-transform duration-700 ease-out"
                                style={{
                                    backgroundColor: ["#FF5733", "#2c3e50", "#00b894", "#fdcb6e", "#6c5ce7", "#e84393", "#3498db", "#e74c3c", "#f1c40f", "#2ecc71"][i % 10],
                                    width: `${80 + (i % 3) * 40}px`,
                                    height: `${80 + (i % 3) * 40}px`,
                                    left: `${10 + (i % 5) * 15}%`,
                                    top: `${10 + Math.floor(i / 5) * 35}%`,
                                    transform: `translate(${(mousePos.x - 50) * (0.1 + (i % 5) * 0.05)}%, ${(mousePos.y - 50) * (0.1 + (i % 5) * 0.05)}%)`,
                                    animationDelay: `${i * 0.5}s`,
                                    animationDuration: `${10 + i * 2}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: scale(1) translate(0, 0); }
                    33% { transform: scale(1.1) translate(10px, -20px); }
                    66% { transform: scale(0.9) translate(-15px, 15px); }
                }
                .animate-blob {
                    animation: blob 15s infinite alternate ease-in-out;
                }
            `}</style>
        </section>
    )
}
