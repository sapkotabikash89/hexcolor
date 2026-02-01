import type { Metadata } from "next";
import { Suspense } from "react";
import { ColorPickerClientContent } from "./color-picker-client";
import { ToolApplicationSchema } from "@/components/structured-data";

export const metadata: Metadata = {
    title: "HTML Color Picker - Free Online Tool for Web Designers | HexColorMeans",
    description: "Advanced HTML color picker with HEX, RGB, and HSL support. Perfect for web developers and designers looking for precise color selection and WCAG accessibility info.",
    keywords: [
        "html color picker",
        "color selector",
        "hex code finder",
        "rgb color tool",
        "hsl color picker",
        "web design color tool",
        "online color picker",
    ],
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: "https://hexcolormeans.com/html-color-picker",
    },
    openGraph: {
        title: "HTML Color Picker - Precision Web Design Tool | HexColorMeans",
        description: "Select and explore HTML color codes with our professional-grade interactive picker. Get instant HEX, RGB, and HSL values with accessibility insights.",
        url: "https://hexcolormeans.com/html-color-picker",
        siteName: "HexColorMeans",
        type: "website",
        images: [
            {
                url: "https://hexcolormeans.com/advanced-color-picker-tool-online-free.webp",
                width: 1200,
                height: 630,
                alt: "Professional HTML Color Picker and Design Information Tool",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "HTML Color Picker - Professional Web Design Tool | HexColorMeans",
        description: "Find the perfect color for your web projects with our advanced HTML color picker. High-fidelity results in HEX, RGB, and HSL.",
        images: ["https://hexcolormeans.com/advanced-color-picker-tool-online-free.webp"],
    },
};

export default function HtmlColorPickerPage() {
    return (
        <>
            <ToolApplicationSchema 
                name="HTML Color Picker" 
                slug="html-color-picker" 
                description="Advanced HTML color picker with HEX, RGB, and HSL support. Perfect for web developers and designers looking for precise color selection and WCAG accessibility info." 
            />
            <Suspense fallback={<div className="flex flex-col min-h-screen"><div className="flex-1 flex items-center justify-center"><div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div><p className="mt-2 text-muted-foreground">Loading...</p></div></div></div>}>
                <ColorPickerClientContent />
            </Suspense>
        </>
    );
}
