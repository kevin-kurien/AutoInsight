// src/components/Layout/Navbar.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <div className={styles.logo}>
              <span className={styles.logoText}>Predicta</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          <Link href="/upload">
            <span className={styles.navLink}>Upload</span>
          </Link>
          <Link href="/datasets">
            <span className={styles.navLink}>My Datasets</span>
          </Link>
          <Link href="/models">
            <span className={styles.navLink}>Models</span>
          </Link>
          <Link href="/help">
            <span className={styles.navLink}>Help</span>
          </Link>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton}>
            Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.menuButton} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className={styles.menuIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/upload">
            <span className={styles.mobileNavLink}>Upload</span>
          </Link>
          <Link href="/datasets">
            <span className={styles.mobileNavLink}>My Datasets</span>
          </Link>
          <Link href="/models">
            <span className={styles.mobileNavLink}>Models</span>
          </Link>
          <Link href="/help">
            <span className={styles.mobileNavLink}>Help</span>
          </Link>
          <button className={styles.mobileActionButton}>
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;