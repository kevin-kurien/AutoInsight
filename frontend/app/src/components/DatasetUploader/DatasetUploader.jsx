// src/components/DatasetUploader/DatasetUploader.jsx
import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import FileItem from './FileItem';
import Button from '../UI/Button';
import styles from './DatasetUploader.module.css';

const DatasetUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const intervalRefs = useRef({});

  const onDrop = useCallback((acceptedFiles) => {
    if (isUploading) return;
    
    // Add new files to the state
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) => ({
        file,
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'ready'
      }))
    ]);
    
    // Clear any previous errors
    setUploadError(null);
  }, [isUploading]);

  const { 
    getRootProps, 
    getInputProps, 
    isDragActive, 
    isDragAccept, 
    isDragReject, 
    open 
  } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    disabled: isUploading,
    noClick: files.length > 0,
    noKeyboard: files.length > 0
  });

  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return;
    
    setIsUploading(true);
    setUploadError(null);
    const newUploadedFiles = [];
    
    // Process each file
    for (const fileObj of files.filter(f => f.status === 'ready')) {
      try {
        // Update file status to uploading
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === fileObj.id ? { ...f, status: 'uploading' } : f
          )
        );
        
        // Create a progress tracking function
        let progress = 0;
        intervalRefs.current[fileObj.id] = setInterval(() => {
          // Don't go past 90% until we get actual confirmation
          if (progress < 90) {
            progress += 5;
            setUploadProgress(prev => ({
              ...prev,
              [fileObj.id]: Math.round(progress)
            }));
          }
        }, 200);
        
        // Create form data
        const formData = new FormData();
        formData.append('file', fileObj.file);
        
        // Make API call to upload the file
        const response = await fetch('http://localhost:5001/api/files/upload', {
          method: 'POST',
          body: formData,
        });
        
        // Clear the progress interval
        clearInterval(intervalRefs.current[fileObj.id]);
        delete intervalRefs.current[fileObj.id];
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed');
        }
        
        const result = await response.json();
        
        // Set progress to 100% and update status
        setUploadProgress(prev => ({
          ...prev,
          [fileObj.id]: 100
        }));
        
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === fileObj.id ? { ...f, status: 'complete' } : f
          )
        );
        
        // Add to uploaded files with the server-assigned ID
        newUploadedFiles.push({
          ...fileObj,
          serverId: result.file.id
        });
        
      } catch (error) {
        console.error('Error uploading file:', error);
        
        // Clear interval
        if (intervalRefs.current[fileObj.id]) {
          clearInterval(intervalRefs.current[fileObj.id]);
          delete intervalRefs.current[fileObj.id];
        }
        
        // Update file status to error
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === fileObj.id ? { ...f, status: 'error' } : f
          )
        );
        
        setUploadError(`Error uploading ${fileObj.name}: ${error.message}`);
      }
    }
    
    setIsUploading(false);
    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
  };

  const cancelUpload = () => {
    // Clear all intervals
    Object.values(intervalRefs.current).forEach(clearInterval);
    intervalRefs.current = {};
    
    setIsUploading(false);
    
    // Reset uploading files to ready state
    setFiles(prevFiles => 
      prevFiles.map(f => 
        f.status === 'uploading' ? { ...f, status: 'ready' } : f
      )
    );
    
    // Reset progress
    const resetProgress = {};
    files.forEach(file => {
      if (file.status === 'uploading') {
        resetProgress[file.id] = 0;
      }
    });
    
    setUploadProgress(prev => ({
      ...prev,
      ...resetProgress
    }));
  };

  const startProcessing = async () => {
    if (uploadedFiles.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // For simplicity, just process the first file
      const fileToProcess = uploadedFiles[0];
      
      const response = await fetch(`http://localhost:5001/api/files/${fileToProcess.serverId}/process`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Processing failed');
      }
      
      const result = await response.json();
      console.log('Processing started:', result);
      
      // In a real app, you might redirect to a results page here
      // window.location.href = `/results/${fileToProcess.serverId}`;

    } catch (error) {
      console.error('Error processing file:', error);
      setUploadError (`Error starting processing: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (fileId) => {
    // Clear interval if exists
    if (intervalRefs.current[fileId]) {
      clearInterval(intervalRefs.current[fileId]);
      delete intervalRefs.current[fileId];
    }
    
    setFiles(files.filter(file => file.id !== fileId));
    
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const clearAll = () => {
    // Cancel any ongoing uploads
    if (isUploading) {
      cancelUpload();
    }
    
    // Clear all files
    setFiles([]);
    setUploadProgress({});
    setUploadedFiles([]);
    setUploadError(null);
  };

  // Determine the dropzone state classes
  const dropzoneClass = isDragActive
    ? isDragAccept
      ? styles.activeAccept
      : isDragReject
        ? styles.activeReject
        : styles.active
    : styles.dropzone;

  // Get counts
  const readyCount = files.filter(f => f.status === 'ready').length;
  const uploadingCount = files.filter(f => f.status === 'uploading').length;
  const completeCount = files.filter(f => f.status === 'complete').length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Upload Datasets</h1>
        <p className={styles.subtitle}>
          Upload your dataset files to begin the prediction process with Predicta
        </p>
      </div>
      
      <motion.div 
        {...getRootProps()} 
        className={dropzoneClass}
        whileHover={files.length === 0 ? { scale: 1.01 } : {}}
        whileTap={files.length === 0 ? { scale: 0.99 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input {...getInputProps()} />
        
        {files.length === 0 ? (
          <div className={styles.dropzoneContent}>
            <div className={styles.iconContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div>
              <p className={styles.dropzoneText}>
                {isDragActive 
                  ? isDragReject 
                    ? 'File type not supported' 
                    : 'Drop the files here' 
                  : 'Drag & drop your dataset files here'}
              </p>
              <p className={styles.dropzoneSubtext}>or click to browse files</p>
            </div>
            
            <div className={styles.dropzoneInfo}>
              <p>Supported formats: CSV, Excel, JSON</p>
              <p>Maximum file size: 100MB</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              className={styles.fileListContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.fileListHeader}>
                <h2 className={styles.fileListTitle}>Selected Files</h2>
                <div className={styles.fileListActions}>
                  {uploadingCount > 0 && (
                    <Button 
                      className={styles.cancelButton} 
                      onClick={cancelUpload}
                      variant="danger"
                    >
                      Cancel Upload
                    </Button>
                  )}
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || readyCount === 0}
                    className={styles.uploadButton}
                    variant="primary"
                  >
                    {isUploading ? `Uploading... (${uploadingCount})` : `Upload Files (${readyCount})`}
                    </Button>
                </div>
              </div>
              {uploadError && (
                <div className={styles.errorMessage}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{uploadError}</span>
                </div>
              )}

              <div className={styles.fileList}>
                <AnimatePresence>
                  {files.map((file) => (
                    <FileItem
                      key={file.id}
                      file={file}
                      progress={uploadProgress[file.id] || 0}
                      onRemove={() => removeFile(file.id)}
                      disabled={isUploading && file.status === 'uploading'}
                    />
                  ))}
                </AnimatePresence>
              </div>
              
              <div className={styles.clearContainer}>
                {files.length > 0 && !isUploading && (
                  <Button variant="text" className={styles.clearButton} onClick={clearAll}>
                    Clear All
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.successMessage}
        >
          <div className={styles.successContent}>
            <div className={styles.successIconContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.successIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className={styles.successTitle}>Files successfully uploaded!</h3>
              <p className={styles.successText}>
                {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'} ready for processing.
              </p>
            </div>
          </div>
          <div className={styles.successActions}>
            <Button 
              variant="success" 
              className={styles.continueButton}
              onClick={startProcessing}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Continue to Processing'}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DatasetUploader;