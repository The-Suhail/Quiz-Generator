import { Routes, Route, Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Dashboard from '@/components/Dashboard';
import UploadPage from '@/components/UploadPage';
import FileDetailPage from '@/components/FileDetailPage';
import ThemeToggle from '@/components/ThemeToggle';
import QuizPage from '@/components/QuizPage';

function App() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-foreground flex flex-col overflow-hidden">
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/60 z-50 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Quiz Generator
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1">
              <Link to="/" className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 font-medium text-sm">
                Dashboard
              </Link>
              <Link to="/upload" className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 font-medium text-sm">
                Upload PDF
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="h-full px-4 sm:px-6 lg:px-8 py-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/file/:fileId" element={<FileDetailPage />} />
            <Route path="/file/:fileId/quiz" element={<QuizPage />} />
          </Routes>
        </div>
      </main>
      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-t border-slate-200/60 dark:border-slate-700/60 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8 py-3 text-center text-xs text-slate-600 dark:text-slate-400">
          &copy; {new Date().getFullYear()} Quiz Generator - Powered by AI
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

export default App;
