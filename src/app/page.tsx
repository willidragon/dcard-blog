//page.tsx

import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* ... Your existing code for header, Next & Vercel logos, etc. ... */}

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Head>
          <title>Dcard Issue Blog</title>
          <link rel="stylesheet" href="/styles/globals.css" />
        </Head>

        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-6">
            Welcome to Dcard Issue Blog
          </h1>
          <Link href="/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* ... Your existing code for the footer ... */}
    </main>
  );
};

export default Home;
