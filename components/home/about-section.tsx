import { Card } from "@/components/ui/card"
import { Palette, BookOpen, Zap, Shield } from "lucide-react"

export function AboutSection() {
    const features = [
        {
            icon: Palette,
            title: "Professional Tools",
            description: "Access industry-standard color tools for design, development, and creative work",
        },
        {
            icon: BookOpen,
            title: "Color Knowledge",
            description: "Learn color meanings, psychology, and symbolism to make informed creative decisions",
        },
        {
            icon: Zap,
            title: "Instant Conversions",
            description: "Convert between HEX, RGB, HSL, CMYK, and more with precision and speed",
        },
        {
            icon: Shield,
            title: "Privacy First",
            description: "All tools run in your browser. Your images and data never leave your device",
        },
    ]

    return (
        <Card className="p-6 space-y-4">
            <div className="space-y-2 text-left max-w-3xl">
                <p className="text-lg text-muted-foreground leading-relaxed">
                    ColorMean is your comprehensive color companion, designed for designers, developers, artists,
                    and anyone passionate about colors. We provide detailed color information, meanings, and
                    professional-grade tools to help you make the perfect color choices for your projects.
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
                    Whether you're looking for the perfect shade, need to check color accessibility, or want to
                    understand color harmonies, ColorMean has you covered.
                </p>
            </div>
        </Card>
    )
}
