import Head from 'next/head';
import Link from 'next/link';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ColorSidebar } from '../components/sidebar';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ColorMean
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Know Your Color - Professional Color Tools & Information
          </p>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/color-wheel" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-dot w-6 h-6"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>
                </div>
                <h3 className="font-semibold text-lg">Color Wheel</h3>
                <p className="text-sm text-muted-foreground">Create harmonious color schemes</p>
              </div>
            </Link>
            
            <Link href="/color-picker" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-droplet w-6 h-6"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 4.5 12 4.5 2 9 2 14.5 6.477 22 12 22z"/></svg>
                </div>
                <h3 className="font-semibold text-lg">Color Picker</h3>
                <p className="text-sm text-muted-foreground">Pick colors from anywhere</p>
              </div>
            </Link>
            
            <Link href="/contrast-checker" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-contrast w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z"/></svg>
                </div>
                <h3 className="font-semibold text-lg">Contrast Checker</h3>
                <p className="text-sm text-muted-foreground">Check WCAG accessibility standards</p>
              </div>
            </Link>
            
            <Link href="/color-blindness-simulator" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye w-6 h-6"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/></svg>
                </div>
                <h3 className="font-semibold text-lg">Color Blindness Simulator</h3>
                <p className="text-sm text-muted-foreground">See colors through different vision types</p>
              </div>
            </Link>
            
            <Link href="/colors" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor w-6 h-6"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
                </div>
                <h3 className="font-semibold text-lg">Color Library</h3>
                <p className="text-sm text-muted-foreground">Browse thousands of colors</p>
              </div>
            </Link>
            
            <Link href="/palette-from-image" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette w-6 h-6"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.8-.1 2.6-.4 3.3-1.3 4.4-2.2 4.4-2.2-1.1-2.6-3.9-3.6-3.9-3.6-2.3.2-4.1 2.3-4.1 2.3-1.4-1.1-2.2-1.4-2.2-1.4-1.5-.3-.2 1.1-.2 1.1 1.3 1.3 2.9 1.5 2.9 1.5 1.7.2 3.4-.1 4.4-1.2 1.5-1.6 2.1-4.3.6-5.8-1.3-1.3-3.2-1.2-4.4.2-1.5 1.7-1.7 4.2-.6 5.7.6.8 1.5 1.2 2.5 1.2.3 0 .6-.1.9-.2.5-.2.8-.6.8-1.1 0-.8-.8-1.5-1.6-1.4 0 0-.9.2-1.7 1.2-.6.7-.7 1.6-.7 1.6-.1.8.6 1.4 1.4 1.4 2.3-.1 4.1-2.1 4.1-2.1 1.9-2 2.9-3.9 2.9-3.9.1-.5.1-1.1.1-1.7z"/></svg>
                </div>
                <h3 className="font-semibold text-lg">Palette from Image</h3>
                <p className="text-sm text-muted-foreground">Extract colors from images</p>
              </div>
            </Link>
          </div>
          
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-8 space-y-4 mt-8">
            <h2 className="text-2xl font-bold">About ColorMean</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p><strong className="text-foreground">ColorMean</strong> is your comprehensive color companion, designed for designers, developers, artists, and anyone passionate about colors. We provide detailed color information, meanings, and professional-grade tools to help you make the perfect color choices for your projects.</p>
              <p>Whether you're looking for the perfect shade, need to check color accessibility, or want to understand color harmonies, ColorMean has you covered. Our platform combines intuitive tools with in-depth color knowledge to empower your creative work.</p>
              <h3 className="text-lg font-semibold text-foreground pt-4">What You Can Do:</h3>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong className="text-foreground">Explore Color Information:</strong> Get detailed color codes in HEX, RGB, HSL, CMYK, HSV, and LAB formats</li>
                <li><strong className="text-foreground">Discover Color Meanings:</strong> Learn about the psychology and symbolism behind different colors</li>
                <li><strong className="text-foreground">Find Color Harmonies:</strong> Generate complementary, analogous, triadic, and more color schemes</li>
                <li><strong className="text-foreground">Check Accessibility:</strong> Ensure your color combinations meet WCAG standards</li>
                <li><strong className="text-foreground">Extract Colors from Images:</strong> Build palettes from your favorite photos</li>
                <li><strong className="text-foreground">Test Color Blindness:</strong> See how your colors appear to people with different vision types</li>
              </ul>
              <p className="pt-4">Start exploring colors today and discover how ColorMean can enhance your creative workflow!</p>
            </div>
          </div>
        </div>
        
        <ColorSidebar color="#5B6FD8" />
      </main>
      
      <Footer />
    </div>
  );
}