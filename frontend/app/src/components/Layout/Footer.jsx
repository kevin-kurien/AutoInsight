// src/components/Layout/Footer.jsx
import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.branding}>
            <h2 className={styles.logo}>Predicta</h2>
            <p className={styles.tagline}>
              Advanced data prediction and analysis tool
            </p>
          </div>
          
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Product</h3>
              <ul className={styles.linkList}>
                <li><Link href="/features"><span className={styles.link}>Features</span></Link></li>
                <li><Link href="/pricing"><span className={styles.link}>Pricing</span></Link></li>
                <li><Link href="/documentation"><span className={styles.link}>Documentation</span></Link></li>
                <li><Link href="/api"><span className={styles.link}>API</span></Link></li>
              </ul>
            </div>
            
            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Resources</h3>
              <ul className={styles.linkList}>
                <li><Link href="/help"><span className={styles.link}>Help Center</span></Link></li>
                <li><Link href="/blog"><span className={styles.link}>Blog</span></Link></li>
                <li><Link href="/tutorials"><span className={styles.link}>Tutorials</span></Link></li>
              </ul>
            </div>
            
            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Company</h3>
              <ul className={styles.linkList}>
                <li><Link href="/about"><span className={styles.link}>About</span></Link></li>
                <li><Link href="/contact"><span className={styles.link}>Contact</span></Link></li>
                <li><Link href="/careers"><span className={styles.link}>Careers</span></Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            &copy; {currentYear} Predicta. All rights reserved.
          </div>
          
          <div className={styles.legal}>
            <Link href="/privacy"><span className={styles.legalLink}>Privacy Policy</span></Link>
            <Link href="/terms"><span className={styles.legalLink}>Terms of Service</span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;