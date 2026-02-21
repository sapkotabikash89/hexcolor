import React from "react"
import {
    BookOpen,
    ArrowRightLeft,
    Layers,
    Palette,
    Eye, // For Contrast
    EyeOff, // For Blindness
    Code,
    Grid,
    Smile, // Icons
    LayoutTemplate, // Mockups
    Link as LinkIcon, // Related
    HelpCircle,
    FileText,
    Pipette,
    Hash,
    History,
    Sparkles,
    Brain,
    User,
    Globe,
    Moon,
    Hammer,
    Info
} from "lucide-react"

interface TableOfContentsProps {
    currentHex: string
    mobileOnly?: boolean
    hideFaqs?: boolean
    items?: Array<{ id: string; label: string; icon?: any }>
}

const BLOG_ICONS: Record<string, any> = {
    "definition": BookOpen,
    "history": History,
    "symbolism": Sparkles,
    "spiritual-meaning": Hash,
    "psychology": Brain,
    "personality": User,
    "cultural-meaning": Globe,
    "dreams-meaning": Moon,
    "uses": Hammer,
    "technical-information": Info,
}

export function TableOfContents({ currentHex, mobileOnly = false, hideFaqs = false, items }: TableOfContentsProps) {
    let navItems = items || [
        { id: "information", label: "Color Codes", icon: FileText },
        { id: "meaning", label: "Meaning", icon: BookOpen },
        { id: "conversion", label: "Conversion", icon: ArrowRightLeft },
        { id: "variations", label: "Shades & Tints", icon: Layers },
        { id: "harmonies", label: "Palettes", icon: Palette },
        { id: "contrast-checker", label: "Contrast", icon: Eye },
        { id: "blindness-simulator", label: "Blindness", icon: EyeOff },
        { id: "css-examples", label: "CSS & Styles", icon: Code },
        { id: "patterns", label: "Patterns", icon: Grid },
        { id: "icons", label: "Icons", icon: Smile },
        { id: "mockups", label: "Mockups", icon: LayoutTemplate },
        { id: "related-colors", label: "Related", icon: LinkIcon },
        { id: "faqs", label: "FAQs", icon: HelpCircle },
    ]

    if (!items && hideFaqs) {
        navItems = navItems.filter(item => item.id !== "faqs")
    }

    if (mobileOnly) {
        return (
            <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
                <div className="flex overflow-x-auto no-scrollbar items-center whitespace-nowrap py-3 px-4 gap-4">
                    {navItems.map((item) => {
                        const Icon = item.icon || BLOG_ICONS[item.id] || Hash

                        return (
                            <a
                                key={`mobile-${item.id}`}
                                href={`#${item.id}`}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shrink-0 bg-muted text-muted-foreground hover:text-foreground"
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {item.label}
                            </a>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <nav className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 hidden lg:block w-full">
            <div className="space-y-1">
                <div className="mb-6 p-4 rounded-lg bg-card border shadow-sm flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-md shadow-sm border border-border flex items-center justify-center"
                        style={{ backgroundColor: currentHex }}
                    >
                        <Pipette className="w-4 h-4 text-white mix-blend-difference" />
                    </div>
                    <span className="font-mono font-bold text-sm">{currentHex.replace('#', '').toUpperCase()}</span>
                </div>

                <div className="font-medium text-xs text-muted-foreground uppercase px-4 mb-2 tracking-wider">
                    On this page
                </div>

                {navItems.map((item) => {
                    const Icon = item.icon || BLOG_ICONS[item.id] || Hash

                    return (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group text-left text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        >
                            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                            {item.label}
                        </a>
                    )
                })}
            </div>
        </nav>
    )
}
