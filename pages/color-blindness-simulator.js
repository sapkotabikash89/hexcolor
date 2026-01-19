import Head from 'next/head';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ColorBlindnessSimulatorTool } from '../components/tools/color-blindness-simulator-tool';

export default function ColorBlindnessSimulator() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Color Blindness Simulator</h1>
        <ColorBlindnessSimulatorTool />
      </main>
      <Footer />
    </div>
  );
}