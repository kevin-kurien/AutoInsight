// src/pages/upload.js
import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import DatasetUploader from '../components/DatasetUploader/DatasetUploader';

const UploadPage = () => {
  return (
    <>
      <Head>
        <title>Upload Dataset | Predicta</title>
        <meta name="description" content="Upload your datasets for prediction and analysis with Predicta" />
      </Head>
      
      <Layout>
        <DatasetUploader />
      </Layout>
    </>
  );
};

export default UploadPage;