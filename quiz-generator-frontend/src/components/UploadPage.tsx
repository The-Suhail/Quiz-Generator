import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UploadPage() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const file = fileInput.current?.files?.[0];
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:5001/api/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/file/${res.data.file_id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4 max-w-md mx-auto mt-8 p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-bold mb-2">Upload a PDF</h2>
      <Input type="file" accept="application/pdf" ref={fileInput} disabled={uploading} />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload PDF'}
      </Button>
    </form>
  );
} 