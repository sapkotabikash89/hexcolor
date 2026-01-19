import Head from 'next/head';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ScreenColorPickerTool } from '../components/tools/screen-color-picker-tool';

export default function ScreenColorPicker() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Screen Color Picker</h1>
        <ScreenColorPickerTool />
      </main>
      <Footer />
    </div>
  );
}