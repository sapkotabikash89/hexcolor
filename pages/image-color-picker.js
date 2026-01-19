import Head from 'next/head';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ImageColorPickerTool } from '../components/tools/image-color-picker-tool';

export default function ImageColorPicker() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Image Color Picker</h1>
        <ImageColorPickerTool />
      </main>
      <Footer />
    </div>
  );
}