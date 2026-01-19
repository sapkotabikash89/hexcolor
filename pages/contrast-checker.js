import Head from 'next/head';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ContrastCheckerTool } from '../components/tools/contrast-checker-tool';

export default function ContrastChecker() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Contrast Checker</h1>
        <ContrastCheckerTool />
      </main>
      <Footer />
    </div>
  );
}