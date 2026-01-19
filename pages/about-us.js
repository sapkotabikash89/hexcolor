import Head from 'next/head';
import Link from 'next/link';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <div className="prose max-w-none">
          <p>Welcome to our website. Learn more about who we are and what we do.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}