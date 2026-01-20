"use client"

import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface GrowSubscribeCTAProps {
    variant?: "inline" | "sidebar"
    title?: string
    description?: string
}

export function GrowSubscribeCTA({
    variant = "inline",
    title = "Know Your Color",
    description = "Join our community of color enthusiasts and get expert tips delivered to your inbox."
}: GrowSubscribeCTAProps) {
    const formId = "U3Vic2NyaWJlV2lkZ2V0Ojc3ZWU2YmEwLWIzY2QtNGJjNy05YmUzLWRlNzdmZGIxZjFiOQ"

    const handleSubscribe = () => {
        if (typeof (window as any).growMe === 'function') {
            try {
                // Use standard command pattern
                ; (window as any).growMe('triggerSubscribePopup', { id: formId })
                // Fallback for direct method call
                if ((window as any).growMe.triggerSubscribePopup) {
                    ; (window as any).growMe.triggerSubscribePopup(formId)
                }
            } catch (e) {
                console.warn("Grow subscribe trigger failed", e)
            }
        }
    }

    if (variant === "sidebar") {
        return (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                    <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
                <Button onClick={handleSubscribe} className="w-full gap-2">
                    Subscribe Now
                </Button>
            </div>
        )
    }

    return (
        <div className="my-12 p-8 bg-muted/30 border border-border rounded-xl flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Mail className="w-8 h-8" />
            </div>
            <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground text-sm max-w-lg">
                    {description}
                </p>
            </div>
            <div className="shrink-0">
                <Button onClick={handleSubscribe} size="lg" className="px-8 font-semibold">
                    Joint Content News
                </Button>
            </div>
        </div>
    )
}
