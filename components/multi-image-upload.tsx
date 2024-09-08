'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

export default function MultiImageUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      // Handle successful upload (e.g., show success message, clear form)
    } catch (error) {
      console.error('Upload error:', error);
      // Handle error (e.g., show error message)
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

  return (
    <div className='space-y-4'>
      <Input
        type='file'
        multiple
        onChange={handleFileChange}
        disabled={uploading}
      />
      <Button onClick={handleUpload} disabled={uploading || files.length === 0}>
        {uploading ? 'Uploading...' : 'Upload Images'}
      </Button>
      {uploading && <Progress value={progress} className='w-full' />}
    </div>
  );
}
