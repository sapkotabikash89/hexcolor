import Head from 'next/head';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ColorLibrary } from '../components/color-library';

export default function ColorsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Color Library</h1>
        <ColorLibrary />
      </main>
      <Footer />
    </div>
  );
}