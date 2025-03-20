// src/pages/_app.js
import '../styles/globals.css';
import { Inter } from 'next/font/google';

// Initialize the Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

function MyApp({ Component, pageProps }) {
  return (
    <main className={`${inter.variable} font-sans` }>
    <Component {...pageProps} />
  </main>
);
}

export default MyApp;