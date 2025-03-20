// src/components/DatasetUploader/FileItem.jsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './FileItem.module.css';

const FileItem = ({ file, progress, onRemove, disabled }) => {
  // Determine file type icon
  const getFileIcon = () => {
    if (file.type.includes('csv') || file.name.endsWith('.csv')) {
      return (
        <svg className={styles.fileIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 13L8 15L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 17L16 15L14 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (
      file.type.includes('excel') || 
      file.name.endsWith('.xlsx') || 
      file.name.endsWith('.xls')
    ) {
      return (
        <svg className={styles.fileIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (file.type.includes('json') || file.name.endsWith('.json')) {
      return (
        <svg className={styles.fileIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 13C8 12.4477 8.44772 12 9 12C9.55228 12 10 12.4477 10 13V17C10 17.5523 9.55228 18 9 18C8.44772 18 8 17.5523 8 17V13Z" fill="currentColor"/>
          <path d="M12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17C13 17.5523 12.5523 18 12 18Z" fill="currentColor"/>
          <path d="M14 13C14 12.4477 14.4477 12 15 12C15.5523 12 16 12.4477 16 13V17C16 17.5523 15.5523 18 15 18C14.4477 18 14 17.5523 14 17V13Z" fill="currentColor"/>
        </svg>
      );
    } else {
      return (
        <svg className={styles.fileIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
  };

  // Get status badge component based on file status
  const getStatusBadge = () => {
    switch (file.status) {
      case 'ready':
        return <span className={`${styles.badge} ${styles.readyBadge}`}>Ready</span>;
        case 'uploading':
          return <span className={`${styles.badge} ${styles.uploadingBadge}`}>Uploading</span>;
          case 'complete':
            return <span className={`${styles.badge} ${styles.completeBadge}`}>Complete</span>;
            case 'error':
              return <span className={`${styles.badge} ${styles.errorBadge}`}>Failed</span>;
              default:
                return null;
            }
          };
        
          // Format file size to human readable format
          const formatFileSize = (bytes) => {
            if (bytes === 0) return '0 Bytes';
            
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
          };
        
          return (
            <motion.div 
              className={styles.fileItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className={styles.fileHeader}>
                <div className={styles.fileInfo}>
                  <div className={styles.fileIconContainer}>
                    {getFileIcon()}
                  </div>
                  <div className={styles.fileDetails}>
                    <div className={styles.fileNameContainer}>
                      <p className={styles.fileName}>{file.name}</p>
                      {getStatusBadge()}
                    </div>
                    <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={onRemove}
                  className={styles.removeButton}
                  disabled={disabled}
                  aria-label="Remove file"
                >
                  <svg className={styles.removeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
        
              {(progress > 0 || file.status === 'uploading') && (
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <motion.div
                      className={styles.progressFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div className={styles.progressInfo}>
                    <span className={styles.progressText}>{progress}%</span>
                    {file.status === 'complete' && (
                      <span className={styles.progressSuccess}>Complete</span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        };
        
        export default FileItem;