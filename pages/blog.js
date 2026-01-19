import Head from 'next/head';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <div className="prose max-w-none">
          <p>Welcome to our blog. Check out our latest articles.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}