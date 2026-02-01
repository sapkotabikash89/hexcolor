import type { Metadata } from "next";
import { ColorPickerClientContent } from "./color-picker-client";

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
    return <ColorPickerClientContent />;
}
