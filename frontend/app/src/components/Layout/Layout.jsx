// src/components/Layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;