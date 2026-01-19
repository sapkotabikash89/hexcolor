import Head from 'next/head';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ColorWheelTool } from '../components/tools/color-wheel-tool';

export default function ColorWheel() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Color Wheel</h1>
        <ColorWheelTool />
      </main>
      <Footer />
    </div>
  );
}