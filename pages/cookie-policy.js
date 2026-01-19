import Head from 'next/head';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

export default function CookiePolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
        <div className="prose max-w-none">
          <p>Our cookie policy information.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}