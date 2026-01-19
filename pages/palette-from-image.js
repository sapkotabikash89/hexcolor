import Head from 'next/head';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { PaletteFromImageTool } from '../components/tools/palette-from-image-tool';

export default function PaletteFromImage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Palette from Image</h1>
        <PaletteFromImageTool />
      </main>
      <Footer />
    </div>
  );
}