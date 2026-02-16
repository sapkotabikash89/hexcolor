import { Card } from "@/components/ui/card"
import { Palette, BookOpen, Zap, Shield } from "lucide-react"

export function AboutSection() {
    const features = [
        {
            icon: Palette,
            title: "Professional Tools",
            description: "Use industry-ready color utilities designed for design systems, UI work, and development workflows.",
        },
        {
            icon: BookOpen,
            title: "Color Knowledge",
            description: "Learn the meaning, psychology, symbolism, and cultural context behind colors to guide smarter creative decisions.",
        },
        {
            icon: Zap,
            title: "Instant Conversions",
            description: "Convert HEX, RGB, HSL, CMYK, and related formats with speed and accuracy.",
        },
        {
            icon: Shield,
            title: "Privacy First",
            description: "All tools run directly in your browser. Your images and data stay on your device.",
        },
    ]

    return (
        <Card className="p-6 space-y-4">
            <div className="space-y-2 text-left max-w-3xl">
                <p className="text-lg text-muted-foreground leading-relaxed">
                    HexColorMeans is built for designers, developers, artists, and anyone who works with color daily.
                    The site delivers clear color data, meaningful context, and practical tools that help you choose colors with confidence and purpose.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, i) => {
                    const Icon = feature.icon
                    return (
                        <div key={i} className="flex gap-4 p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <div className="space-y-2 text-left">
                                <h3 className="font-semibold text-lg">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="pt-2 text-left">
                <p className="text-muted-foreground">
                    Whether you are selecting the right shade, checking color accessibility, or working with balanced color relationships, HexColorMeans gives you the clarity and precision you need.
                </p>
            </div>
        </Card>
    )
}
