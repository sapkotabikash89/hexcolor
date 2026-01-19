import Head from 'next/head';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { AdvancedColorPicker } from '../components/tools/advanced-color-picker';

export default function ColorPicker() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Color Picker</h1>
        <AdvancedColorPicker />
      </main>
      <Footer />
    </div>
  );
}