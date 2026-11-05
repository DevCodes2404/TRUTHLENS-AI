import { useState, useCallback, useRef } from 'react';
import type { UploadedFile, UploadState, FileValidationResult } from '@/types';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function useFileUpload() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const idCounter = useRef(0);

  const validateFile = useCallback((file: File): FileValidationResult => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Unsupported file type: ${file.type || 'unknown'}. Please upload JPG, PNG, or WEBP.`,
      };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`,
      };
    }
    return { valid: true };
  }, []);

  const processFile = useCallback(
    (file: File) => {
      setUploadState('validating');
      setValidationError(null);

      const result = validateFile(file);
      if (!result.valid) {
        setValidationError(result.error!);
        setUploadState('error');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      const id = `upload-${Date.now()}-${idCounter.current++}`;
      setUploadedFile({ file, previewUrl, id });
      setUploadState('ready');
      setUploadProgress(0);
    },
    [validateFile],
  );

  const removeFile = useCallback(() => {
    if (uploadedFile?.previewUrl) {
      URL.revokeObjectURL(uploadedFile.previewUrl);
    }
    setUploadedFile(null);
    setUploadState('idle');
    setValidationError(null);
    setUploadProgress(0);
  }, [uploadedFile]);

  const simulateProgress = useCallback(() => {
    setUploadState('uploading');
    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadState('ready');
      }
      setUploadProgress(Math.min(progress, 100));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return {
    uploadedFile,
    uploadState,
    validationError,
    uploadProgress,
    processFile,
    removeFile,
    simulateProgress,
    acceptedTypes: ACCEPTED_IMAGE_TYPES,
    maxSizeMB: MAX_FILE_SIZE_MB,
  };
}

