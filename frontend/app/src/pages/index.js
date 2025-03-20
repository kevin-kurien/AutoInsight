// src/pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to upload page
    router.push('/upload');
  }, [router]);

  return (
    <>
      <Head>
        <title>Predicta - Data Prediction Tool</title>
        <meta name="description" content="Upload and process your datasets for accurate predictions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-blue-600">Predicta</h1>
          <p className="mt-2 text-gray-600">Redirecting to upload page...</p>
        </div>
      </div>
    </>
  );
}