import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface FileInfo {
  file_id: string;
  filename: string;
  content_length: number;
  has_summary: boolean;
  has_quiz: boolean;
}

export default function Dashboard() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:5001/api/list-files')
      .then(res => {
        setFiles(res.data.files || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to fetch files');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading files...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Processed Files</h2>
      {files.length === 0 ? (
        <div>No files found. <Link to="/upload" className="underline">Upload a PDF</Link>.</div>
      ) : (
        <div className="space-y-2">
          {files.map(file => (
            <Card key={file.file_id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{file.filename}</div>
                <div className="text-sm text-muted-foreground">{(file.content_length/1024).toFixed(1)} KB</div>
                <div className="text-xs mt-1">
                  Summary: <span className={file.has_summary ? 'text-green-600' : 'text-gray-400'}>{file.has_summary ? 'Ready' : 'Not generated'}</span> | Quiz: <span className={file.has_quiz ? 'text-green-600' : 'text-gray-400'}>{file.has_quiz ? 'Ready' : 'Not generated'}</span>
                </div>
              </div>
              <Link to={`/file/${file.file_id}`} className="underline text-primary">View</Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 