import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

interface FileInfo {
  file_id: string;
  filename: string;
  content_length: number;
  has_summary: boolean;
  has_quiz: boolean;
}

export default function FileDetailPage() {
  const { fileId } = useParams();
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  useEffect(() => {
    if (!fileId) return;
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:5001/api/file-info/${fileId}`)
      .then(res => {
        setFileInfo(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to fetch file info');
        setLoading(false);
      });
  }, [fileId]);

  useEffect(() => {
    if (!fileInfo) return;
    if (fileInfo.has_summary) {
      axios.post(`http://localhost:5001/api/generate-summary/${fileInfo.file_id}`)
        .then(res => setSummary(res.data.summary))
        .catch(() => setSummary(null));
    }
  }, [fileInfo]);

  const handleDownload = (type: 'summary' | 'quiz') => {
    if (!fileInfo) return;
    window.open(`http://localhost:5001/api/download/${type}/${fileInfo.file_id}`, '_blank');
  };

  const handleGenerateSummary = async () => {
    if (!fileInfo) return;
    setGeneratingSummary(true);
    setError(null);
    try {
      await axios.post(`http://localhost:5001/api/generate-summary/${fileInfo.file_id}`);
      setFileInfo({ ...fileInfo, has_summary: true });
    } catch {
      setError('Failed to generate summary.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!fileInfo) return;
    setGeneratingQuiz(true);
    setError(null);
    try {
      await axios.post(`http://localhost:5001/api/generate-quiz/${fileInfo.file_id}`);
      setFileInfo({ ...fileInfo, has_quiz: true });
    } catch {
      setError('Failed to generate quiz.');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-600 dark:text-slate-400 text-lg">Loading file details...</p>
    </div>
  );
  if (error) return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
        <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
      </div>
      <p className="text-red-600 dark:text-red-400 text-lg font-medium">{error}</p>
    </div>
  );
  if (!fileInfo) return null;

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border-indigo-200 dark:border-slate-600 overflow-hidden flex-shrink-0">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* File Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{fileInfo.filename}</h1>
                  <p className="text-slate-600 dark:text-slate-400">{(fileInfo.content_length/1024).toFixed(1)} KB</p>
                </div>
              </div>
              {/* Status Indicators */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${fileInfo.has_summary ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                  <span className={`text-sm font-medium ${fileInfo.has_summary ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>Summary {fileInfo.has_summary ? 'Ready' : 'Pending'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${fileInfo.has_quiz ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                  <span className={`text-sm font-medium ${fileInfo.has_quiz ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>Quiz {fileInfo.has_quiz ? 'Ready' : 'Pending'}</span>
                </div>
              </div>
            </div>
            {/* Quiz Navigation Button */}
            <div className="flex flex-col gap-4 lg:items-end">
              {!fileInfo.has_quiz && (
                <Button
                  onClick={handleGenerateQuiz}
                  disabled={generatingQuiz}
                  className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {generatingQuiz ? 'Generating Quiz...' : 'Generate Quiz'}
                </Button>
              )}
              {fileInfo.has_quiz && (
                <Button
                  onClick={() => window.location.href = `/file/${fileInfo.file_id}/quiz`}
                  className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Take Quiz
                </Button>
              )}
              {/* Download Buttons */}
              <div className="flex gap-3 w-full lg:w-auto">
                {!fileInfo.has_summary && (
                  <Button
                    onClick={handleGenerateSummary}
                    disabled={generatingSummary}
                    variant="outline"
                    className="flex-1 lg:flex-initial border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    {generatingSummary ? 'Generating Summary...' : 'Generate Summary'}
                  </Button>
                )}
                {fileInfo.has_summary && (
                  <Button 
                    onClick={() => handleDownload('summary')} 
                    disabled={!fileInfo.has_summary} 
                    variant="outline"
                    className="flex-1 lg:flex-initial border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Summary
                  </Button>
                )}
                {fileInfo.has_quiz && (
                  <Button 
                    onClick={() => handleDownload('quiz')} 
                    disabled={!fileInfo.has_quiz} 
                    variant="outline"
                    className="flex-1 lg:flex-initial border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Quiz
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* Summary Section (no tabs) */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-slate-200 dark:border-slate-700 shadow-xl flex-1 flex flex-col">
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-4 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Document Summary</h2>
          </div>
          {!fileInfo.has_summary ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">No summary generated yet</h3>
                <p className="text-slate-600 dark:text-slate-400">Click the "Generate Summary" button above to create an AI-powered summary of this document.</p>
              </div>
            </div>
          ) : summary ? (
            <div className="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed flex-1 overflow-y-auto">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 border-t-slate-600 dark:border-t-slate-300 rounded-full animate-spin"></div>
                <span className="text-slate-600 dark:text-slate-400">Loading summary...</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}