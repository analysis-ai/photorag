'use client';

import React, { useState } from 'react';

import { uploadImages } from '@/app/actions/upload-images-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Uploading...' : 'Upload Images'}
    </Button>
  );
}

export default function MultiImageUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  async function handleUpload(formData: FormData) {
    setUploading(true);
    setProgress(0);

    // Add all selected files to the FormData
    files.forEach((file) => {
      formData.append(`images`, file);
    });

    try {
      const result = await uploadImages(formData);
      console.log('Upload successful:', result);
      // Handle successful upload (e.g., show success message, clear form)
      setFiles([]); // Clear the files state after successful upload
    } catch (error) {
      console.error('Upload error:', error);
      // Handle error (e.g., show error message)
    } finally {
      setUploading(false);
      setProgress(100);
    }
  }

  return (
    <div className='space-y-4'>
      <form action={handleUpload}>
        <Input
          type='file'
          onChange={handleFileChange}
          multiple
          disabled={uploading}
        />
        <input type='hidden' name='userId' value='1' />
        <SubmitButton />
        {uploading && <Progress value={progress} className='w-full' />}
      </form>
      {files.length > 0 && (
        <div>
          <p>Selected files:</p>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
