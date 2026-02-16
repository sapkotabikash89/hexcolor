"use client"

import React from 'react'

interface ColorMockupsProps {
    color: string
}

export function ColorMockups({ color }: ColorMockupsProps) {
    // Common background
    const Background = () => (
        <rect x="0" y="0" width="400" height="400" fill="#f4f4f5" />
    )

    const mockups = [
        {
            name: "Colored T-Shirt",
            category: "Fashion",
            render: (c: string) => (
                <svg viewBox="0 0 400 400" className="w-full h-full">
                    <Background />
                    <g transform="translate(60, 40)">
                        {/* Floor Shadow */}
                        <ellipse cx="140" cy="310" rx="100" ry="15" fill="black" opacity="0.2" filter="blur(10px)" />

                        <g filter="url(#shadow-soft)">
                            {/* Back Neck Inside */}
                            <path d="M110,50 Q140,75 170,50" fill={c} filter="brightness(0.6)" />

                            {/* Main Body */}
                            <path
                                d="M110,50 L60,70 L40,130 L70,145 L70,300 L210,300 L210,145 L240,130 L220,70 L170,50 Q140,85 110,50"
                                fill={c}
                            />
                            {/* Fabric Texture Filter Applied to a Rect or Overlay (Fixing invalid fill) */}
                            {/* Since fill='url(#filter)' is invalid, we'll use a pattern or just simple opacity overlay for now to ensure color shows */}
                            <path
                                d="M110,50 L60,70 L40,130 L70,145 L70,300 L210,300 L210,145 L240,130 L220,70 L170,50 Q140,85 110,50"
                                fill="black"
                                filter="url(#fabric-texture)"
                                opacity="0.1"
                                style={{ mixBlendMode: 'multiply' }}
                            />

                            {/* Neck Ribbing (Slightly lighter/darker) */}
                            <path d="M110,50 Q140,85 170,50 Q140,95 110,50" fill={c} filter="brightness(0.9)" />

                            {/* Sleeve Hems (Subtle darkness) */}
                            <path d="M48,125 L40,130 L70,145 L74,140 Z" fill="black" opacity="0.1" />
                            <path d="M232,125 L240,130 L210,145 L206,140 Z" fill="black" opacity="0.1" />

                            {/* Simple Shading to simulate form */}
                            <linearGradient id="shirt-volume" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0" stopColor="black" stopOpacity="0.2" />
                                <stop offset="0.2" stopColor="white" stopOpacity="0.1" />
                                <stop offset="0.5" stopColor="white" stopOpacity="0" />
                                <stop offset="0.8" stopColor="white" stopOpacity="0.1" />
                                <stop offset="1" stopColor="black" stopOpacity="0.2" />
                            </linearGradient>
                            <path
                                d="M110,50 L60,70 L40,130 L70,145 L70,300 L210,300 L210,145 L240,130 L220,70 L170,50 Q140,85 110,50"
                                fill="url(#shirt-volume)"
                                style={{ mixBlendMode: 'overlay' }}
                            />
                        </g>
                    </g>
                </svg>
            )
        },
        {
            name: "Baseball Cap",
            category: "Fashion",
            render: (c: string) => (
                <svg viewBox="0 0 400 400" className="w-full h-full">
                    <Background />
                    <g transform="translate(60, 100)">
                        {/* Shadow */}
                        <ellipse cx="140" cy="180" rx="100" ry="20" fill="black" opacity="0.2" filter="blur(10px)" />

                        {/* Back Interior */}
                        <path d="M80,140 Q140,100 200,140" stroke="black" strokeWidth="1" fill="none" opacity="0.2" />

                        {/* Cap Crown/Dome (Front View essentially) */}
                        <path
                            d="M60,140 
                               Q60,40 140,40 
                               Q220,40 220,140"
                            fill={c}
                        />
                        <path d="M60,140 Q60,40 140,40 Q220,40 220,140" fill="url(#fabric-texture)" opacity="0.3" style={{ mixBlendMode: 'multiply' }} />

                        {/* Cap Panels Seams */}
                        <path d="M140,40 L140,120" stroke="black" opacity="0.1" strokeWidth="1" />
                        <path d="M140,40 Q100,60 80,140" stroke="black" opacity="0.1" strokeWidth="1" />
                        <path d="M140,40 Q180,60 200,140" stroke="black" opacity="0.1" strokeWidth="1" />

                        {/* Top Button */}
                        <ellipse cx="140" cy="40" rx="10" ry="5" fill={c} filter="brightness(0.9)" />

                        {/* Brim/Visor */}
                        <path
                            d="M40,140 
                               Q140,110 240,140 
                               Q240,180 140,190 
                               Q40,180 40,140"
                            fill={c}
                            filter="brightness(1.1)"
                        />
                        {/* Brim stitching */}
                        <path d="M50,145 Q140,120 230,145" stroke="white" strokeWidth="1" strokeDasharray="3,3" fill="none" opacity="0.6" />
                        <path d="M50,155 Q140,170 230,155" stroke="white" strokeWidth="1" strokeDasharray="3,3" fill="none" opacity="0.6" />

                        {/* Front Panel Structure Shading */}
                        <path d="M60,140 Q60,40 140,40 Q220,40 220,140 L40,140 Q140,110 240,140 Z" fill="url(#cylinder-shine)" opacity="0.2" style={{ mixBlendMode: 'overlay' }} />

                        {/* Ventilation Eyelets */}
                        <circle cx="100" cy="80" r="3" fill="#333" opacity="0.4" />
                        <circle cx="180" cy="80" r="3" fill="#333" opacity="0.4" />
                    </g>
                </svg>
            )
        },
        {
            name: "Living Room",
            category: "Interior",
            render: (c: string) => (
                <svg viewBox="0 0 400 400" className="w-full h-full">
                    <Background />

                    {/* Window in background */}
                    <rect x="150" y="50" width="160" height="120" fill="#dbeafe" stroke="#333" strokeWidth="2" />
                    <line x1="230" y1="50" x2="230" y2="170" stroke="#333" strokeWidth="2" />
                    <line x1="150" y1="110" x2="310" y2="110" stroke="#333" strokeWidth="2" />
                    {/* Curtains */}
                    <rect x="130" y="40" width="30" height="140" fill="#a3b18a" stroke="#333" strokeWidth="1" />
                    <rect x="300" y="40" width="30" height="140" fill="#a3b18a" stroke="#333" strokeWidth="1" />

                    {/* TV Stand (Left) */}
                    <g transform="translate(20, 180)">
                        <rect x="0" y="100" width="140" height="60" fill="#8d6e63" stroke="#333" strokeWidth="2" /> {/* Stand Body */}
                        <rect x="5" y="140" width="10" height="20" fill="#5d4037" /> {/* Leg */}
                        <rect x="125" y="140" width="10" height="20" fill="#5d4037" /> {/* Leg */}

                        {/* TV Screen */}
                        <rect x="10" y="40" width="120" height="70" fill="#333" stroke="#111" strokeWidth="3" />
                        <rect x="15" y="45" width="110" height="60" fill="#222" />
                        <path d="M15,105 L30,45" stroke="white" opacity="0.1" /> {/* Reflection */}
                    </g>

                    {/* Sofa (Right) - Using Color */}
                    <g transform="translate(180, 160)">
                        {/* Backrest */}
                        <path d="M20,20 Q100,10 180,20 L180,100 L20,100 Z" fill={c} stroke="#333" strokeWidth="2" />

                        {/* Seat Cushions */}
                        <rect x="20" y="100" width="80" height="40" fill={c} stroke="#333" strokeWidth="2" />
                        <rect x="100" y="100" width="80" height="40" fill={c} stroke="#333" strokeWidth="2" />

                        {/* Arms */}
                        <path d="M0,60 Q20,60 20,140 L0,140 Z" fill={c} filter="brightness(0.9)" stroke="#333" strokeWidth="2" />
                        <path d="M180,60 Q200,60 200,140 L180,140 Z" fill={c} filter="brightness(0.9)" stroke="#333" strokeWidth="2" />

                        {/* Legs */}
                        <rect x="10" y="140" width="10" height="15" fill="#5d4037" />
                        <rect x="180" y="140" width="10" height="15" fill="#5d4037" />
                    </g>
                </svg>
            )
        },
        {
            name: "Office Complex",
            category: "Exterior",
            render: (c: string) => (
                <svg viewBox="0 0 400 400" className="w-full h-full">
                    <Background />
                    <g transform="translate(80, 60)">
                        {/* Right Tower (Taller) */}
                        <path d="M120,0 L200,40 L200,300 L120,300 Z" fill={c} stroke={c} strokeWidth="1" /> {/* Front Face */}
                        <path d="M200,40 L240,60 L240,300 L200,300 Z" fill={c} filter="brightness(0.7)" /> {/* Side Face */}

                        {/* Windows Right Tower */}
                        <g fill="#fff" opacity="0.8">
                            <rect x="130" y="20" width="60" height="10" />
                            <rect x="130" y="40" width="60" height="10" />
                            <rect x="130" y="60" width="60" height="10" />
                            <rect x="130" y="80" width="60" height="10" />
                            <rect x="130" y="100" width="60" height="10" />
                            <rect x="130" y="120" width="60" height="10" />
                            <rect x="130" y="140" width="60" height="10" />
                            <rect x="130" y="160" width="60" height="10" />
                            <rect x="130" y="180" width="60" height="10" />
                        </g>

                        {/* Left Tower (Shorter) */}
                        <path d="M0,100 L100,60 L100,300 L0,300 Z" fill={c} stroke={c} strokeWidth="1" /> {/* Front Face */}
                        <path d="M0,100 L-30,120 L-30,300 L0,300 Z" fill={c} filter="brightness(0.7)" /> {/* Side Face */}

                        {/* Windows Left Tower */}
                        <g fill="#fff" opacity="0.8">
                            <rect x="10" y="110" width="80" height="8" />
                            <rect x="10" y="130" width="80" height="8" />
                            <rect x="10" y="150" width="80" height="8" />
                            <rect x="10" y="170" width="80" height="8" />
                            <rect x="10" y="190" width="80" height="8" />
                            <rect x="10" y="210" width="80" height="8" />
                        </g>

                        {/* Ground/Base Line */}
                        <rect x="-40" y="300" width="300" height="10" fill="#8d6e63" />

                        {/* Doorways */}
                        <rect x="30" y="260" width="30" height="40" fill="#fff" />
                        <rect x="140" y="250" width="40" height="50" fill="#fff" />

                    </g>
                </svg>
            )
        },
        {
            name: "Aluminum Can",
            category: "Brands",
            render: (c: string) => (
                <svg viewBox="0 0 400 400" className="w-full h-full">
                    <Background />
                    <defs>
                        <linearGradient id="can-metal-gray" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#999" />
                            <stop offset="20%" stopColor="#ddd" />
                            <stop offset="50%" stopColor="#fff" />
                            <stop offset="80%" stopColor="#ddd" />
                            <stop offset="100%" stopColor="#999" />
                        </linearGradient>
                        <linearGradient id="cylinder-shine" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="black" stopOpacity="0.4" />
                            <stop offset="20%" stopColor="black" stopOpacity="0.1" />
                            <stop offset="35%" stopColor="white" stopOpacity="0.1" />
                            <stop offset="50%" stopColor="white" stopOpacity="0.6" />
                            <stop offset="65%" stopColor="white" stopOpacity="0.1" />
                            <stop offset="80%" stopColor="black" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="black" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>

                    <ellipse cx="200" cy="350" rx="70" ry="12" fill="black" opacity="0.25" filter="blur(6px)" />

                    <g transform="translate(130, 60)">
                        <ellipse cx="70" cy="20" rx="70" ry="15" fill="url(#can-metal-gray)" stroke="#666" strokeWidth="0.5" />
                        <rect x="0" y="20" width="140" height="260" fill={c} />
                        <rect x="0" y="20" width="140" height="260" fill="url(#cylinder-shine)" style={{ mixBlendMode: 'hard-light' }} />
                        <g transform="translate(90, 150) rotate(-90)">
                            <text x="0" y="0" textAnchor="middle" fill="white" fontFamily="Arial Black, sans-serif" fontSize="40" letterSpacing="2" opacity="0.85" style={{ mixBlendMode: 'overlay' }}>BRAND</text>
                        </g>
                        <path d="M0,280 Q70,300 140,280 L140,290 Q70,310 0,290 Z" fill="url(#can-metal-gray)" />
                    </g>
                </svg>
            )
        },
        {
            name: "Glossy Sportscar",
            category: "Vehicle",
            render: (c: string) => (
                <svg viewBox="0 0 400 400" className="w-full h-full">
                    <Background />
                    <defs>
                        <linearGradient id="metallic-shine" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                            <stop offset="45%" stopColor="white" stopOpacity="0" />
                            <stop offset="50%" stopColor="white" stopOpacity="0.5" />
                            <stop offset="55%" stopColor="white" stopOpacity="0" />
                            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
                        </linearGradient>
                    </defs>
                    <g transform="translate(0, 60)">
                        <ellipse cx="200" cy="265" rx="160" ry="20" fill="black" opacity="0.4" filter="blur(10px)" />
                        <path d="M40,210 Q40,170 100,160 L140,120 L280,120 L330,160 Q380,170 380,210 Q380,250 350,250 L70,250 Q40,250 40,210" fill={c} />
                        <path d="M150,125 L270,125 L310,160 L110,160 Z" fill="#222" />
                        <path d="M150,125 L200,125 L160,160 L110,160 Z" fill="white" opacity="0.08" />
                        <path d="M40,210 Q40,170 100,160 L330,160 Q380,170 380,210" fill="url(#metallic-shine)" style={{ mixBlendMode: 'overlay' }} />
                        <g>
                            <circle cx="90" cy="250" r="35" fill="#111" />
                            <circle cx="90" cy="250" r="22" fill="#333" />
                            <circle cx="90" cy="250" r="14" fill="#666" stroke="#999" strokeWidth="2" />

                            <circle cx="310" cy="250" r="35" fill="#111" />
                            <circle cx="310" cy="250" r="22" fill="#333" />
                            <circle cx="310" cy="250" r="14" fill="#666" stroke="#999" strokeWidth="2" />
                        </g>
                    </g>
                </svg>
            )
        },
        {
            name: "Shopping Bag",
            category: "Brands",
            render: (c: string) => (
                <svg viewBox="0 0 400 400" className="w-full h-full">
                    <Background />
                    <g transform="translate(100, 80)">
                        <path d="M10,240 L190,240 L200,255 L0,255 Z" fill="black" opacity="0.2" filter="blur(8px)" />
                        <path d="M70,40 C70,-20 130,-20 130,40" fill="none" stroke="#222" strokeWidth="6" />
                        <path d="M0,40 L160,40 L180,225 L20,225 Z" fill={c} filter="brightness(0.85)" />
                        <path d="M20,40 L180,40 L200,240 L0,240 Z" fill={c} />
                        <path d="M70,40 C70,-20 130,-20 130,40" fill="none" stroke="#111" strokeWidth="6" />
                        <path d="M70,40 C70,-20 130,-20 130,40" fill="none" stroke="#333" strokeWidth="1.5" />
                        <circle cx="100" cy="140" r="28" fill="white" opacity="0.9" />
                    </g>
                </svg>
            )
        },
        {
            name: "Matte Wall",
            category: "Interior",
            render: (c: string) => (
                <svg viewBox="0 0 400 400" className="w-full h-full">
                    <Background />
                    <rect x="50" y="50" width="300" height="250" fill={c} />
                    <linearGradient id="wall-shadow" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="black" stopOpacity="0.2" />
                        <stop offset="1" stopColor="black" stopOpacity="0" />
                    </linearGradient>
                    <rect x="50" y="50" width="300" height="250" fill="url(#wall-shadow)" />
                    <rect x="40" y="300" width="320" height="15" fill="#fff" />

                    <g transform="translate(130, 100)">
                        <rect x="0" y="0" width="140" height="180" fill="white" />
                        <rect x="8" y="8" width="124" height="124" fill="#f8f8f8" stroke="#eee" />
                        <circle cx="70" cy="70" r="30" fill={c} opacity="0.5" />
                    </g>
                </svg>
            )
        },
        {
            name: "Flagship Phone",
            category: "Brands",
            render: (c: string) => (
                <svg viewBox="0 0 400 400" className="w-full h-full">
                    <Background />
                    <g transform="translate(120, 60)">
                        <rect x="10" y="10" width="160" height="280" rx="24" fill="black" opacity="0.2" filter="blur(10px)" />
                        <rect x="0" y="0" width="160" height="280" rx="24" fill={c} />
                        <rect x="-2" y="-2" width="164" height="284" rx="26" fill="none" stroke="#888" strokeWidth="3" />
                        <linearGradient id="glass-reflection" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="white" stopOpacity="0.05" />
                        </linearGradient>
                        <rect x="0" y="0" width="160" height="280" rx="24" fill="url(#glass-reflection)" />
                        <rect x="12" y="12" width="60" height="70" rx="14" fill="black" opacity="0.1" />
                        <rect x="14" y="14" width="56" height="66" rx="12" fill={c} filter="brightness(0.9)" />
                        <circle cx="42" cy="36" r="10" fill="#111" />
                        <circle cx="42" cy="66" r="10" fill="#111" />
                        <circle cx="80" cy="180" r="16" fill="white" opacity="0.9" />
                    </g>
                </svg>
            )
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mockups.map((mockup, idx) => (
                <div key={idx} className="group flex flex-col gap-2">
                    <div className="relative aspect-square rounded-lg overflow-hidden border border-border bg-[#f4f4f5] transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]">
                        <div className="absolute inset-0">
                            {mockup.render(color)}
                        </div>
                        {/* Badge for category */}
                        <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 text-white text-[10px] font-bold tracking-wider uppercase rounded shadow-sm backdrop-blur-sm">
                            {mockup.category}
                        </div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <span className="font-medium text-sm text-foreground/80">{mockup.name}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}
